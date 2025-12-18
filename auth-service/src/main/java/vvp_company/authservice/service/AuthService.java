package vvp_company.authservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.authservice.dto.LoginRequest;
import vvp_company.authservice.dto.RegistrationRequest;
import vvp_company.authservice.dto.TokenInfo;
import vvp_company.authservice.exception.AuthException;
import vvp_company.authservice.model.Employee;
import vvp_company.authservice.model.Role;
import vvp_company.authservice.model.User;
import vvp_company.authservice.repository.EmployeeRepository;
import vvp_company.authservice.repository.RoleRepository;
import vvp_company.authservice.repository.UserRepository;
import vvp_company.authservice.security.JwtTokenProvider;
import vvp_company.authservice.security.PasswordUtil;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;
    private final RoleRepository roleRepo;
    private final JwtTokenProvider jwt;

    private final String pepper;

    public AuthService(
            UserRepository userRepo,
            EmployeeRepository employeeRepo,
            RoleRepository roleRepo,
            JwtTokenProvider jwt,
            @Value("${security.pepper}") String pepper
    ) {
        this.userRepo = userRepo;
        this.employeeRepo = employeeRepo;
        this.roleRepo = roleRepo;
        this.jwt = jwt;
        this.pepper = pepper == null ? "" : pepper;
    }

    @Transactional
    public String register(RegistrationRequest req) {
        if (userRepo.findByUsername(req.name()).isPresent()) {
            throw new IllegalArgumentException("User exists");
        }

        // Проверяем employee_id
        Employee employee = employeeRepo.findById(req.employee_id())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + req.employee_id()));

        // Проверяем, нет ли уже user для этого employee
        if (userRepo.findByEmployeeId(req.employee_id()).isPresent()) {
            throw new IllegalArgumentException("User already exists for employee: " + req.employee_id());
        }

        String salt = PasswordUtil.generateSalt();
        String hashed = PasswordUtil.hashPassword(req.password().toCharArray(), salt, pepper);

        Role baseRole = roleRepo.findByName("ROLE_USER")
                .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_USER").build()));

        User user = User.builder()
                .username(req.name())
                .passwordHash(hashed)
                .salt(salt)
                .employeeId(req.employee_id())
                .createdAt(LocalDateTime.now())
                .active(true)
                .roles(Set.of(baseRole))
                .build();

        user = userRepo.save(user);

        // post/department из employee
        String department = employee.getDepartment();
        String post = employee.getPost();

        Set<String> roles = Set.of(baseRole.getName());

        return jwt.createToken(user.getId(), user.getEmployeeId(), user.getUsername(), post, department, roles);
    }

    @Transactional(readOnly = true)
    public String login(LoginRequest req) {
        User user = userRepo.findByUsername(req.name())
                .orElseThrow(() -> new AuthException("Invalid credentials"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new AuthException("User is inactive");
        }

        boolean ok = PasswordUtil.verifyPassword(
                req.password().toCharArray(),
                user.getPasswordHash(),
                user.getSalt(),
                pepper
        );
        if (!ok) throw new IllegalArgumentException("Invalid credentials");

        Employee employee = employeeRepo.findById(user.getEmployeeId())
                .orElseThrow(() -> new IllegalStateException("Employee not found for user"));

        String department = employee.getDepartment();
        String post = employee.getPost();

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return jwt.createToken(user.getId(), user.getEmployeeId(), user.getUsername(), post, department, roles);
    }


    @Transactional
    public User addRoleToUser(Long userId, String roleName) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new AuthException("User not found: " + userId));

        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new AuthException("Role not found: " + roleName));

        if (user.getRoles().contains(role)) {
            throw new IllegalArgumentException("User already has role: " + roleName);
        }

        user.getRoles().add(role);
        return userRepo.save(user);
    }

    @Transactional
    public User removeRoleFromUser(Long userId, String roleName) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new AuthException("User not found: " + userId));

        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new AuthException("Role not found: " + roleName));

        if (!user.getRoles().contains(role)) {
            throw new IllegalArgumentException("User does not have role: " + roleName);
        }

        // Не удаляем ROLE_USER если это единственная роль
        if (user.getRoles().size() == 1 && "ROLE_USER".equals(roleName)) {
            throw new IllegalArgumentException("Cannot remove last ROLE_USER");
        }

        user.getRoles().remove(role);
        return userRepo.save(user);
    }

    @Transactional
    public User setUserRoles(Long userId, Set<String> roleNames) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new AuthException("User not found: " + userId));

        Set<Role> roles = roleNames.stream()
                .map(roleName -> roleRepo.findByName(roleName)
                        .orElseThrow(() -> new AuthException("Role not found: " + roleName)))
                .collect(Collectors.toSet());

        // Проверяем что есть хотя бы ROLE_USER
        if (!roles.stream().anyMatch(r -> "ROLE_USER".equals(r.getName()))) {
            throw new IllegalArgumentException("User must have ROLE_USER");
        }

        user.setRoles(roles);
        return userRepo.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new AuthException("User not found: " + userId));
    }

    @Transactional(readOnly = true)
    public TokenInfo validateToken(String token) {
        try {
            // Валидируем токен
            if (!jwt.validateToken(token)) {
                throw new AuthException("Invalid or expired token");
            }

            // Извлекаем данные из токена
            Long employeeId = jwt.getEmployeeId(token);
            Long userId = jwt.getUserId(token);
            String username = jwt.getUsername(token);
            String post = jwt.getPost(token);
            String department = jwt.getDepartment(token);
            Set<String> roles = jwt.getRoles(token);

            return TokenInfo.builder()
                    .user_id(userId)
                    .employee_id(employeeId)
                    .username(username)
                    .post(post)
                    .department(department)
                    .roles(roles)
                    .build();

        } catch (Exception e) {
            throw new AuthException("Token validation failed: " + e.getMessage());
        }
    }

}