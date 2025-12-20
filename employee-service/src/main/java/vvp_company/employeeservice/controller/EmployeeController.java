package vvp_company.employeeservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.employeeservice.dto.EmployeeRequestDto;
import vvp_company.employeeservice.dto.EmployeeResponseDto;
import vvp_company.employeeservice.service.EmployeeService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    @GetMapping
    public List<EmployeeResponseDto> getAllEmployees() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public EmployeeResponseDto getEmployee(@PathVariable Long id) {
        return service.findById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponseDto createEmployee(@Valid @RequestBody EmployeeRequestDto dto) {
        return service.create(dto);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @PutMapping("/{id}")
    public EmployeeResponseDto updateEmployee(@PathVariable Long id,
                                              @Valid @RequestBody EmployeeRequestDto dto) {
        return service.update(id, dto);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long id) {
        service.delete(id);
    }
}
