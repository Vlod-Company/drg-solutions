package vvp_company.requestservice.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.requestservice.dto.RequestFilter;
import vvp_company.requestservice.model.Request;
import org.springframework.data.domain.Page;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    @Query("SELECT r FROM Request r WHERE " +
            "(:code IS NULL OR r.requestCode = :code) AND " +
            "(:senderDepartment IS NULL OR r.senderDepartment = :senderDepartment) AND " +
            "(:recipientDepartment IS NULL OR r.recipientDepartment = :recipientDepartment) AND " +
            "(:status IS NULL OR CAST(r.status AS string) = :status) AND " +
            "(:sender IS NULL OR r.senderEmployeeId = :sender) AND " +
            "(:recipient IS NULL OR r.recipientEmployeeId = :recipient)")
    Page<Request> findAllByFilter(
            @Param("code") String code,
            @Param("senderDepartment") String senderDepartment,
            @Param("recipientDepartment") String recipientDepartment,
            @Param("status") String status,
            @Param("sender") Long sender,
            @Param("recipient") Long recipient,
            Pageable pageable);


    Page<Request> findBySenderDepartment(String senderDepartment, Pageable pageable);
    Page<Request> findByRecipientDepartment(String recipientDepartment, Pageable pageable);
    Page<Request> findBySenderEmployeeId(Long employeeId, Pageable pageable);
}
