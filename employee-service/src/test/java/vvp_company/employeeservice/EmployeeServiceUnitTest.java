package vvp_company.employeeservice;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vvp_company.employeeservice.dto.EmployeeMapper;
import vvp_company.employeeservice.dto.EmployeeRequestDto;
import vvp_company.employeeservice.dto.EmployeeResponseDto;
import vvp_company.employeeservice.enm.EmployeeStatus;
import vvp_company.employeeservice.exception.ResourceNotFoundException;
import vvp_company.employeeservice.model.Employee;
import vvp_company.employeeservice.repository.EmployeeRepository;
import vvp_company.employeeservice.service.EmployeeService;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Employee Service Unit Tests")
class EmployeeServiceUnitTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private EmployeeMapper employeeMapper;

    private EmployeeService employeeService;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeService(employeeRepository, employeeMapper);
    }

    // =========================== READ TESTS ===========================

    @Test
    @DisplayName("Should return all employees")
    void testFindAll() {
        // Arrange
        Employee emp1 = createTestEmployee(1L, "John Doe");
        Employee emp2 = createTestEmployee(2L, "Jane Smith");
        List<Employee> employees = Arrays.asList(emp1, emp2);

        EmployeeResponseDto dto1 = createTestResponseDto(1L, "John Doe");
        EmployeeResponseDto dto2 = createTestResponseDto(2L, "Jane Smith");

        when(employeeRepository.findAll()).thenReturn(employees);
        when(employeeMapper.toResponseDto(emp1)).thenReturn(dto1);
        when(employeeMapper.toResponseDto(emp2)).thenReturn(dto2);

        // Act
        List<EmployeeResponseDto> result = employeeService.findAll();

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(2)
                .contains(dto1, dto2);

        verify(employeeRepository, times(1)).findAll();
        verify(employeeMapper, times(2)).toResponseDto(any());
    }

    @Test
    @DisplayName("Should find employee by id")
    void testFindById_Success() {
        // Arrange
        Long id = 1L;
        Employee employee = createTestEmployee(id, "John Doe");
        EmployeeResponseDto responseDto = createTestResponseDto(id, "John Doe");

        when(employeeRepository.findById(id)).thenReturn(Optional.of(employee));
        when(employeeMapper.toResponseDto(employee)).thenReturn(responseDto);

        // Act
        EmployeeResponseDto result = employeeService.findById(id);

        // Assert
        assertThat(result)
                .isNotNull()
                .isEqualTo(responseDto);

        verify(employeeRepository, times(1)).findById(id);
        verify(employeeMapper, times(1)).toResponseDto(employee);
    }

    @Test
    @DisplayName("Should throw exception when employee not found by id")
    void testFindById_NotFound() {
        // Arrange
        Long id = 999L;
        when(employeeRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> employeeService.findById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee")
                .hasMessageContaining(id.toString());

        verify(employeeRepository, times(1)).findById(id);
        verify(employeeMapper, never()).toResponseDto(any());
    }

    @Test
    @DisplayName("Should get employees by ids")
    void testGetByIds_Success() {
        // Arrange
        List<Long> ids = Arrays.asList(1L, 2L);
        Employee emp1 = createTestEmployee(1L, "John Doe");
        Employee emp2 = createTestEmployee(2L, "Jane Smith");
        List<Employee> employees = Arrays.asList(emp1, emp2);

        EmployeeResponseDto dto1 = createTestResponseDto(1L, "John Doe");
        EmployeeResponseDto dto2 = createTestResponseDto(2L, "Jane Smith");

        when(employeeRepository.findAllById(ids)).thenReturn(employees);
        when(employeeMapper.toResponseDto(emp1)).thenReturn(dto1);
        when(employeeMapper.toResponseDto(emp2)).thenReturn(dto2);

        // Act
        List<EmployeeResponseDto> result = employeeService.getByIds(ids);

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(2)
                .contains(dto1, dto2);

        verify(employeeRepository, times(1)).findAllById(ids);
    }

    @Test
    @DisplayName("Should throw exception when no employees found for given ids")
    void testGetByIds_NotFound() {
        // Arrange
        List<Long> ids = Arrays.asList(999L, 1000L);
        when(employeeRepository.findAllById(ids)).thenReturn(List.of());

        // Act & Assert
        assertThatThrownBy(() -> employeeService.getByIds(ids))
                .isInstanceOf(Exception.class);

        verify(employeeRepository, times(1)).findAllById(ids);
    }

    // =========================== CREATE TESTS ===========================

    @Test
    @DisplayName("Should create employee with default values")
    void testCreate_WithDefaults() {
        // Arrange
        EmployeeRequestDto requestDto = new EmployeeRequestDto();
        requestDto.setName("John Doe");
        requestDto.setPost("Developer");
        requestDto.setExperience(5);

        Employee employee = createTestEmployee(1L, "John Doe");
        EmployeeResponseDto responseDto = createTestResponseDto(1L, "John Doe");

        when(employeeMapper.toEntity(requestDto)).thenReturn(employee);
        when(employeeRepository.save(employee)).thenReturn(employee);
        when(employeeMapper.toResponseDto(employee)).thenReturn(responseDto);

        // Act
        EmployeeResponseDto result = employeeService.create(requestDto);

        // Assert
        assertThat(result).isNotNull().isEqualTo(responseDto);
        assertThat(employee.getStatus()).isEqualTo(EmployeeStatus.ACTIVE);
        assertThat(employee.getHiredDate()).isNotNull();

        verify(employeeRepository, times(1)).save(employee);
        verify(employeeMapper, times(1)).toEntity(requestDto);
    }

    @Test
    @DisplayName("Should create employee with provided values")
    void testCreate_WithProvidedValues() {
        // Arrange
        EmployeeRequestDto requestDto = new EmployeeRequestDto();
        requestDto.setName("Jane Smith");
        requestDto.setPost("Manager");
        requestDto.setExperience(10);
        requestDto.setStatus(EmployeeStatus.ACTIVE);
        requestDto.setHiredDate(LocalDate.of(2020, 1, 15));

        Employee employee = createTestEmployee(2L, "Jane Smith");
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setHiredDate(LocalDate.of(2020, 1, 15));

        EmployeeResponseDto responseDto = createTestResponseDto(2L, "Jane Smith");

        when(employeeMapper.toEntity(requestDto)).thenReturn(employee);
        when(employeeRepository.save(employee)).thenReturn(employee);
        when(employeeMapper.toResponseDto(employee)).thenReturn(responseDto);

        // Act
        EmployeeResponseDto result = employeeService.create(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(employee.getStatus()).isEqualTo(EmployeeStatus.ACTIVE);
        assertThat(employee.getHiredDate()).isEqualTo(LocalDate.of(2020, 1, 15));

        verify(employeeRepository, times(1)).save(employee);
    }

    // =========================== UPDATE TESTS ===========================

    @Test
    @DisplayName("Should update employee")
    void testUpdate_Success() {
        // Arrange
        Long id = 1L;
        EmployeeRequestDto requestDto = new EmployeeRequestDto();
        requestDto.setName("Updated Jane");
        requestDto.setPost("Senior Developer");
        requestDto.setExperience(15);
        requestDto.setStatus(EmployeeStatus.ACTIVE);

        Employee existingEmployee = createTestEmployee(id, "John Doe");
        Employee updatedEmployee = createTestEmployee(id, "Updated Jane");

        EmployeeResponseDto responseDto = createTestResponseDto(id, "Updated Jane");

        when(employeeRepository.findById(id)).thenReturn(Optional.of(existingEmployee));
        when(employeeRepository.save(existingEmployee)).thenReturn(updatedEmployee);
        when(employeeMapper.toResponseDto(updatedEmployee)).thenReturn(responseDto);

        // Act
        EmployeeResponseDto result = employeeService.update(id, requestDto);

        // Assert
        assertThat(result).isNotNull().isEqualTo(responseDto);

        verify(employeeRepository, times(1)).findById(id);
        verify(employeeRepository, times(1)).save(existingEmployee);
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent employee")
    void testUpdate_NotFound() {
        // Arrange
        Long id = 999L;
        EmployeeRequestDto requestDto = new EmployeeRequestDto();
        when(employeeRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> employeeService.update(id, requestDto))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(employeeRepository, times(1)).findById(id);
        verify(employeeRepository, never()).save(any());
    }

    // =========================== DELETE TESTS ===========================

    @Test
    @DisplayName("Should delete employee")
    void testDelete_Success() {
        // Arrange
        Long id = 1L;
        when(employeeRepository.existsById(id)).thenReturn(true);

        // Act
        employeeService.delete(id);

        // Assert
        verify(employeeRepository, times(1)).existsById(id);
        verify(employeeRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent employee")
    void testDelete_NotFound() {
        // Arrange
        Long id = 999L;
        when(employeeRepository.existsById(id)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> employeeService.delete(id))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(employeeRepository, times(1)).existsById(id);
        verify(employeeRepository, never()).deleteById(any());
    }

    // =========================== Helper Methods ===========================

    private Employee createTestEmployee(Long id, String name) {
        Employee employee = new Employee();
        employee.setId(id);
        employee.setName(name);
        employee.setPost("Testing Position");
        employee.setDepartment("Test Department");
        employee.setExperience(5);
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setHiredDate(LocalDate.now());
        return employee;
    }

    private EmployeeResponseDto createTestResponseDto(Long id, String name) {
        EmployeeResponseDto dto = new EmployeeResponseDto();
        dto.setId(id);
        dto.setName(name);
        dto.setPost("Testing Position");
        dto.setExperience(5);
        dto.setStatus(EmployeeStatus.ACTIVE.name());
        dto.setHiredDate(LocalDate.now());
        return dto;
    }
}
