package vvp_company.requestservice.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vvp_company.requestservice.model.Request;

import java.util.List;
import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request, Long> {
    Optional<Request> findByRequestCode(String requestCode);
    List<Request> findAllBySenderDepartment(String senderDepartment);
    List<Request> findAllBySenderEmployeeId(Long senderEmployeeId);
    List<Request> findAll();
}