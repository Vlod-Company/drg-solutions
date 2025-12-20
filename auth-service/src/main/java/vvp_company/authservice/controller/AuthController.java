package vvp_company.authservice.controller;



import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import vvp_company.authservice.dto.*;
import vvp_company.authservice.model.User;
import vvp_company.authservice.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vvp_company.authservice.exception.AuthException;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {


    private final AuthService authService;

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegistrationRequest req) {
        var token = authService.register(req);
        return ResponseEntity.ok(new AuthResponse(token, "Bearer"));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        var token = authService.login(req);
        return ResponseEntity.ok(new AuthResponse(token, "Bearer"));
    }

    @PostMapping("/validate")
    public ResponseEntity<TokenInfo> validateToken(@RequestBody ValidateTokenRequest req) {
        TokenInfo info = authService.validateToken(req.token());
        return ResponseEntity.ok(info);
    }

    @GetMapping("/me")
    public ResponseEntity<TokenInfo> me(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        return ResponseEntity.ok(authService.validateToken(token));
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        throw new AuthException("Authorization token not found in header");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @PostMapping("/users/{userId}/roles/add")
    public ResponseEntity<User> addRole(
            @PathVariable Long userId,
            @RequestBody RoleRequest request) {
        User user = authService.addRoleToUser(userId, request.roleName());
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @PostMapping("/users/{userId}/roles/remove")
    public ResponseEntity<User> removeRole(
            @PathVariable Long userId,
            @RequestBody RoleRequest request) {
        User user = authService.removeRoleFromUser(userId, request.roleName());
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @PostMapping("/users/{userId}/roles/set")
    public ResponseEntity<User> setRoles(
            @PathVariable Long userId,
            @RequestBody SetRolesRequest request) {
        User user = authService.setUserRoles(userId, request.roleNames());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId) {
        User user = authService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
}