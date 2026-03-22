package vvp_company.employeeservice;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import vvp_company.employeeservice.dto.EmployeeRequestDto;
import vvp_company.employeeservice.enm.EmployeeStatus;
import vvp_company.employeeservice.model.Employee;
import vvp_company.employeeservice.repository.EmployeeRepository;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Employee Service Integration Tests")
@Transactional
@ActiveProfiles("test")
class EmployeeServiceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should perform complete CRUD operations")
    @WithMockUser(roles = "ADMIN")
    void testCompleteEmployeeCRUDFlow() throws Exception {
        // Step 1: Create an employee
        EmployeeRequestDto createDto = new EmployeeRequestDto();
        createDto.setName("New Employee");
        createDto.setPost("Developer");
        createDto.setDepartment("IT");
        createDto.setExperience(3);
        createDto.setStatus(EmployeeStatus.ACTIVE);
        createDto.setHiredDate(LocalDate.now());

        String createResponse = mockMvc.perform(post("/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("New Employee")))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String employeeId = objectMapper.readTree(createResponse).get("id").asText();

        // Step 2: Verify employee was created
        mockMvc.perform(get("/employees/" + employeeId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Employee")));

        // Step 3: Update the employee
        EmployeeRequestDto updateDto = new EmployeeRequestDto();
        updateDto.setName("Updated Employee");
        updateDto.setPost("Senior Developer");
        updateDto.setDepartment("IT");
        updateDto.setExperience(5);
        updateDto.setStatus(EmployeeStatus.ACTIVE);

        mockMvc.perform(put("/employees/" + employeeId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Employee")))
                .andExpect(jsonPath("$.post", is("Senior Developer")));

        // Step 4: Get all employees
        mockMvc.perform(get("/employees")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        // Step 5: Delete the employee
        mockMvc.perform(delete("/employees/" + employeeId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        // Step 6: Verify employee was deleted
        mockMvc.perform(get("/employees/" + employeeId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should persist employee in database")
    @WithMockUser(roles = "ADMIN")
    void testEmployeePersistence() throws Exception {
        EmployeeRequestDto dto = new EmployeeRequestDto();
        dto.setName("John Persistent");
        dto.setPost("Backend Developer");
        dto.setDepartment("IT");
        dto.setExperience(7);
        dto.setStatus(EmployeeStatus.ACTIVE);
        dto.setHiredDate(LocalDate.of(2020, 1, 15));

        mockMvc.perform(post("/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        Employee employee = employeeRepository.findAll().stream()
                .filter(e -> e.getName().equals("John Persistent"))
                .findFirst()
                .orElse(null);

        assertThat(employee)
                .isNotNull()
                .extracting("name", "post", "experience", "status")
                .contains("John Persistent", "Backend Developer", 7, EmployeeStatus.ACTIVE);
    }

    @Test
    @DisplayName("Should validate required fields on creation")
    @WithMockUser(roles = "ADMIN")
    void testValidationOnCreate() throws Exception {
        mockMvc.perform(post("/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle non-existent employee retrieval")
    void testGetNonExistentEmployee() throws Exception {
        mockMvc.perform(get("/employees/99999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return empty list when no employees exist")
    void testGetAllEmployeesWhenEmpty() throws Exception {
        employeeRepository.deleteAll();

        mockMvc.perform(get("/employees")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("Should update only specific fields")
    @WithMockUser(roles = "ADMIN")
    void testPartialUpdate() throws Exception {
        Employee employee = new Employee();
        employee.setName("Initial Name");
        employee.setPost("Developer");
        employee.setDepartment("IT");
        employee.setExperience(5);
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setHiredDate(LocalDate.now());
        Employee saved = employeeRepository.save(employee);

        EmployeeRequestDto updateDto = new EmployeeRequestDto();
        updateDto.setName("Updated Name");
        updateDto.setPost("Developer");
        updateDto.setDepartment("IT");
        updateDto.setExperience(5);
        updateDto.setStatus(EmployeeStatus.ACTIVE);

        mockMvc.perform(put("/employees/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")));

        Employee updated = employeeRepository.findById(saved.getId()).orElse(null);
        assertThat(updated).isNotNull();
        assertThat(updated.getName()).isEqualTo("Updated Name");
        assertThat(updated.getExperience()).isEqualTo(5);
    }

    @Test
    @DisplayName("Should handle employee status transitions")
    @WithMockUser(roles = "ADMIN")
    void testStatusTransition() throws Exception {
        Employee employee = new Employee();
        employee.setName("Status Test Employee");
        employee.setPost("Developer");
        employee.setDepartment("IT");
        employee.setExperience(3);
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setHiredDate(LocalDate.now());
        Employee saved = employeeRepository.save(employee);

        EmployeeRequestDto updateDto = new EmployeeRequestDto();
        updateDto.setName("Status Test Employee");
        updateDto.setPost("Developer");
        updateDto.setDepartment("IT");
        updateDto.setExperience(3);
        updateDto.setStatus(EmployeeStatus.FIRED);
        updateDto.setFiredDate(LocalDate.now());

        mockMvc.perform(put("/employees/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is(EmployeeStatus.FIRED.name())));
    }

    @Test
    @DisplayName("Should filter employees by IDs")
    void testGetEmployeesByMultipleIds() throws Exception {
        Employee emp1 = createAndSaveEmployee("Employee 1", "Developer");
        Employee emp2 = createAndSaveEmployee("Employee 2", "Manager");

        mockMvc.perform(get("/employees/byIds")
                .param("ids", emp1.getId().toString(), emp2.getId().toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    private Employee createAndSaveEmployee(String name, String post) {
        Employee employee = new Employee();
        employee.setName(name);
        employee.setPost(post);
        employee.setDepartment("Test Department");
        employee.setExperience(5);
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setHiredDate(LocalDate.now());
        return employeeRepository.save(employee);
    }
}
