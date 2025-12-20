package vvp_company.requestservice.model;
import jakarta.persistence.*;
import lombok.*;
import vvp_company.requestservice.enm.RequestStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.CREATED;

    @Column(name = "sender_department", nullable = false)
    private String senderDepartment;

    @Column(name = "recipient_department", nullable = false)
    private String recipientDepartment;

    @Column(name = "request_code", nullable = false)
    private String requestCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String response;

    @Column(name = "sender_employee_id")
    private Long senderEmployeeId;

    @Column(name = "recipient_employee_id")
    private Long recipientEmployeeId;

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP NOT NULL DEFAULT NOW()")
    private LocalDateTime createdAt;

    @Column(name = "closed_at", nullable = false)
    private LocalDateTime closedAt;
}