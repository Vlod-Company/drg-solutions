package vvp_company.authservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vvp_company.authservice.model.User;
import vvp_company.authservice.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }
}
