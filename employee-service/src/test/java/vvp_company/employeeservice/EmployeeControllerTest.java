package vvp_company.employeeservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import vvp_company.employeeservice.controller.EmployeeController;
import vvp_company.employeeservice.dto.EmployeeRequestDto;
import vvp_company.employeeservice.dto.EmployeeResponseDto;
import vvp_company.employeeservice.enm.EmployeeStatus;
import vvp_company.employeeservice.exception.ResourceNotFoundException;
import vvp_company.employeeservice.service.EmployeeService;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Employee Controller Unit Tests")
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeService employeeService;

    @Test
    void testGetAllEmployees() throws Exception {
        when(employeeService.findAll()).thenReturn(List.of(createResponseDto(1L, "John")));

        mockMvc.perform(get("/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void testGetEmployee() throws Exception {
        when(employeeService.findById(1L)).thenReturn(createResponseDto(1L, "John"));

        mockMvc.perform(get("/employees/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John"));
    }

    @Test
    void testCreateEmployee() throws Exception {
        EmployeeRequestDto request = createRequestDto("John");
        when(employeeService.create(any(EmployeeRequestDto.class))).thenReturn(createResponseDto(1L, "John"));

        mockMvc.perform(post("/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testUpdateEmployee() throws Exception {
        EmployeeRequestDto request = createRequestDto("Updated John");
        when(employeeService.update(anyLong(), any(EmployeeRequestDto.class))).thenReturn(createResponseDto(1L, "Updated John"));

        mockMvc.perform(put("/employees/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated John"));
    }

    @Test
    void testDeleteEmployee() throws Exception {
        doNothing().when(employeeService).delete(1L);

        mockMvc.perform(delete("/employees/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteEmployeeNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Employee", 999L)).when(employeeService).delete(999L);

        mockMvc.perform(delete("/employees/999"))
                .andExpect(status().isNotFound());
    }

    private EmployeeRequestDto createRequestDto(String name) {
        EmployeeRequestDto dto = new EmployeeRequestDto();
        dto.setName(name);
        dto.setPost("Developer");
        dto.setDepartment("IT");
        dto.setExperience(5);
        dto.setStatus(EmployeeStatus.ACTIVE);
        dto.setHiredDate(LocalDate.now());
        return dto;
    }

    private EmployeeResponseDto createResponseDto(Long id, String name) {
        EmployeeResponseDto dto = new EmployeeResponseDto();
        dto.setId(id);
        dto.setName(name);
        dto.setPost("Developer");
        dto.setDepartment("IT");
        dto.setExperience(5);
        dto.setStatus(EmployeeStatus.ACTIVE.name());
        dto.setHiredDate(LocalDate.now());
        return dto;
    }
}
