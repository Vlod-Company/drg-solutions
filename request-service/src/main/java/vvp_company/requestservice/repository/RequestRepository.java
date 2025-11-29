package vvp_company.requestservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vvp_company.requestservice.model.Request;

import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request, Long> {
    Optional<Request> findByRequestCode(String requestCode);
}