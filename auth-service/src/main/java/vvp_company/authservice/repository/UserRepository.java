package vvp_company.authservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vvp_company.authservice.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmployeeId(Long employeeId);
}