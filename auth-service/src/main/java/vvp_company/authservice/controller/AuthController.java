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
import vvp_company.authservice.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

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

    @PostMapping("/users/{userId}/roles/add")
    public ResponseEntity<UserDto> addRole(
            @PathVariable Long userId,
            @RequestBody RoleRequest request) {
        User user = authService.addRoleToUser(userId, request.roleName());
        return ResponseEntity.ok(mapToDto(user));
    }

    @PostMapping("/users/{userId}/roles/remove")
    public ResponseEntity<UserDto> removeRole(
            @PathVariable Long userId,
            @RequestBody RoleRequest request) {
        User user = authService.removeRoleFromUser(userId, request.roleName());
        return ResponseEntity.ok(mapToDto(user));
    }

    @PostMapping("/users/{userId}/roles/set")
    public ResponseEntity<UserDto> setRoles(
            @PathVariable Long userId,
            @RequestBody SetRolesRequest request) {
        User user = authService.setUserRoles(userId, request.roleNames());
        return ResponseEntity.ok(mapToDto(user));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long userId) {
        User user = authService.getUserById(userId);
        return ResponseEntity.ok(mapToDto(user));
    }

    @GetMapping("/users")
    public List<UserDto> getUsers() {
        return userService.findAll().stream().map(this::mapToDto).toList();
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .employeeId(user.getEmployeeId())
                .username(user.getUsername())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(java.util.stream.Collectors.toSet()))
                .build();
    }
}