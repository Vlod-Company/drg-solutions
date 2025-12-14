package vvp_company.employeeservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.employeeservice.dto.EmployeeRequestDto;
import vvp_company.employeeservice.dto.EmployeeResponseDto;
import vvp_company.employeeservice.exception.ResourceNotFoundException;
import vvp_company.employeeservice.model.Employee;
import vvp_company.employeeservice.enm.EmployeeStatus;
import vvp_company.employeeservice.repository.EmployeeRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private final EmployeeRepository repository;
    private final vvp_company.employeeservice.dto.EmployeeMapper mapper;

    @Transactional(readOnly = true)
    public List<EmployeeResponseDto> findAll() {
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDto findById(Long id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", id));
        return mapper.toResponseDto(employee);
    }

    @Transactional
    public EmployeeResponseDto create(EmployeeRequestDto dto) {
        Employee employee = mapper.toEntity(dto);
        employee.setHiredDate(dto.getHiredDate() != null ? dto.getHiredDate() : LocalDate.now());
        employee.setStatus(dto.getStatus() != null ? dto.getStatus() : EmployeeStatus.ACTIVE);
        Employee saved = repository.save(employee);
        log.info("Created employee: {}", saved.getId());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public EmployeeResponseDto update(Long id, EmployeeRequestDto dto) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", id));

        employee.setName(dto.getName());
        employee.setPost(dto.getPost());
        employee.setExperience(dto.getExperience());
        employee.setStatus(dto.getStatus());

        Employee updated = repository.save(employee);
        log.info("Updated employee: {}", updated.getId());
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Employee", id);
        }
        repository.deleteById(id);
        log.info("Deleted employee: {}", id);
    }
}
