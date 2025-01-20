package dev.asmaa.ResidenceETU.service;

import dev.asmaa.ResidenceETU.model.Payment;
import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.model.RoomStatus;
import dev.asmaa.ResidenceETU.model.User;
import dev.asmaa.ResidenceETU.repository.PaymentRepository;
import dev.asmaa.ResidenceETU.repository.RoomRepository;
import dev.asmaa.ResidenceETU.repository.UserRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Calendar;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender emailSender; // Service pour envoyer des e-mails

    /**
     * Génère automatiquement les enregistrements de paiements mensuels pour toutes les chambres occupées.
     * Cette méthode est exécutée automatiquement à minuit le premier jour de chaque mois.
     */
    @Scheduled(cron = "0 0 0 1 * ?") // S'exécute à minuit le 1er jour de chaque mois
    public void generateMonthlyPayments() {
        List<Room> occupiedRooms = roomRepository.findByStatus(RoomStatus.OCCUPEE);

        // Calculer la date du premier jour du mois suivant
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1); // Premier jour du mois courant
        calendar.add(Calendar.MONTH, 1); // Passer au mois suivant
        Date nextDueDate = calendar.getTime();

        for (Room room : occupiedRooms) {
            User resident = room.getResident();
            if (resident != null) {
                Payment payment = new Payment();
                payment.setResident(resident); // Associer le résident au paiement
                payment.setRoom(room); // Associer la chambre au paiement
                payment.setAmountDue(room.getPrice()); // Montant dû basé sur le prix de la chambre
                payment.setDueDate(nextDueDate); // Date d'échéance du paiement
                payment.setPaid(false); // Paiement marqué comme non réglé
                paymentRepository.save(payment); // Enregistrer dans la base de données
            }
        }
    }

    /**
     * Récupérer tous les paiements d'un résident spécifique.
     *
     * @param residentId L'identifiant du résident.
     * @return Liste des paiements associés au résident.
     */
    public List<Payment> getResidentPayments(Long residentId) {
        return paymentRepository.findByResident_Id(residentId);
    }

    /**
     * Traiter un paiement en mettant à jour son enregistrement.
     *
     * @param paymentId L'identifiant du paiement.
     * @param amountPaid Le montant payé par le résident.
     */
    public void processPayment(Long paymentId, double amountPaid) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Enregistrement de paiement introuvable"));

        payment.setAmountPaid(payment.getAmountPaid() + amountPaid); // Ajouter au montant déjà payé
        payment.setAmountDue(payment.getAmountDue() - amountPaid); // Réduire le montant dû restant
        payment.setPaid(payment.getAmountDue() <= 0); // Si le montant dû est 0 ou moins, marquer comme payé
        payment.setPaymentDate(new Date()); // Enregistrer la date du paiement
        paymentRepository.save(payment); // Sauvegarder les modifications
    }

    /**
     * Obtenir tous les paiements en retard.
     *
     * @return Liste des paiements en retard.
     */
    public List<Payment> getOverduePayments() {
        return paymentRepository.findByDueDateBeforeAndIsPaidFalse(new Date());
    }

    /**
     * Envoyer des rappels pour les paiements en retard.
     * Cette méthode est exécutée automatiquement à minuit le 15th de chaque mois .
     */
    @Scheduled(cron = "0 0 0 15 * ?")
    public void sendOverduePaymentReminders() {
        List<Payment> overduePayments = getOverduePayments();
        for (Payment payment : overduePayments) {
            User resident = payment.getResident();
            if (resident != null && resident.getEmail() != null) {
                sendEmailReminder(resident.getEmail(), payment); // Envoyer l'email de rappel
            }
        }
    }

    private void sendEmailReminder(String email, Payment payment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Rappel de paiement en retard");
        message.setText("Cher résident,\n\nVous avez un paiement en retard de " + payment.getAmountDue() + " MAD. Veuillez le régler dès que possible.\n\nDétails du paiement :\n" +
                "Numéro de chambre : " + payment.getRoom().getRoomNumber() + "\n" +
                "Date d'échéance : " + payment.getDueDate() + "\n" +
                "Merci,\nL'équipe de gestion.");

        emailSender.send(message); // Envoyer l'email
        System.out.println("Email de rappel envoyé à : " + email); // Log pour confirmation
    }

    /**
     * Récupérer les paiements d'un résident à partir de son nom d'utilisateur.
     *
     * @param username Le nom d'utilisateur du résident.
     * @return Liste des paiements associés.
     */
    @Transactional
    public List<Payment> getResidentPaymentsByUsername(String username) {
        User resident = userRepository.findByUsername(username);
        if (resident != null) {
            List<Payment> payments = paymentRepository.findByResident_Id(resident.getId());
            for (Payment payment : payments) {
                Hibernate.initialize(payment.getRoom()); // Charger la chambre si elle est en chargement différé
            }
            return payments;
        }
        return null; // Gestion du cas où l'utilisateur n'est pas trouvé
    }

    /**
     * Générer un reçu de paiement en format PDF.
     *
     * @param payment Le paiement pour lequel le reçu est généré.
     * @return Un tableau d'octets représentant le PDF généré.
     * @throws DocumentException En cas d'erreur de génération du document.
     * @throws IOException En cas d'erreur d'entrée/sortie.
     */
    public byte[] generateReceipt(Payment payment) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);
        document.open();

        // Ajouter le contenu du reçu au document PDF
        document.add(new Paragraph("Reçu de Paiement"));
        document.add(new Paragraph("Résident : " + payment.getResident().getUsername()));
        document.add(new Paragraph("Numéro de Chambre : " + payment.getRoom().getRoomNumber()));
        document.add(new Paragraph("Montant Dû : " + payment.getAmountDue() + " MAD"));
        document.add(new Paragraph("Montant Payé : " + payment.getAmountPaid() + " MAD"));
        document.add(new Paragraph("Date de Paiement : " + payment.getPaymentDate().toString()));

        if (payment.isPaid()) {
            document.add(new Paragraph("Statut : Payé"));
        } else {
            document.add(new Paragraph("Statut : En attente"));
        }

        document.close();

        return outputStream.toByteArray();
    }

    /**
     * Récupérer un paiement spécifique par son identifiant.
     *
     * @param paymentId L'identifiant du paiement.
     * @return L'enregistrement de paiement correspondant.
     */
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable"));
    }
    public long getOverduePaymentsCount() {
        return paymentRepository.countByDueDateBeforeAndIsPaidFalse(new Date());
    }
}
