package vvp_company.missionservice.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.missionservice.dto.nested.TeamDto;
import vvp_company.missionservice.service.TeamService;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static vvp_company.missionservice.enm.TeamStatus.CREATED;

@ExtendWith(MockitoExtension.class)
class TeamControllerTest {

    @Mock
    private TeamService teamService;

    @InjectMocks
    private TeamController teamController;

    private MockMvc mockMvc;

    private TeamDto teamDto1;
    private TeamDto teamDto2;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(teamController).build();

        teamDto1 = TeamDto.builder()
                .id(1L)
                .name("Alpha Team")
                .status(CREATED)
                .build();

        teamDto2 = TeamDto.builder()
                .id(2L)
                .name("Beta Team")
                .status(CREATED)
                .build();
    }

    @Test
    void createTeam_WithValidName_ShouldReturnCreatedTeam() throws Exception {
        // Arrange
        when(teamService.createTeam("Gamma Team")).thenReturn(teamDto1);

        // Act & Assert
        mockMvc.perform(post("/team")
                        .param("teamName", "Gamma Team")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Alpha Team")))
                .andExpect(jsonPath("$.status", is(CREATED.name())));

        verify(teamService, times(1)).createTeam("Gamma Team");
    }

    @Test
    void createTeam_WithEmptyName_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(post("/team")
                        .param("teamName", "")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        verify(teamService, never()).createTeam(anyString());
    }

    @Test
    void createTeam_WithNullName_ShouldReturnBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/team")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()); // отсутствует обязательный параметр

        verify(teamService, never()).createTeam(anyString());
    }

    @Test
    void getAllTeams_ShouldReturnListOfTeams() throws Exception {
        // Arrange
        List<TeamDto> teams = Arrays.asList(teamDto1, teamDto2);
        when(teamService.findAllTeams()).thenReturn(teams);

        // Act & Assert
        mockMvc.perform(get("/team")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Alpha Team")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Beta Team")));

        verify(teamService, times(1)).findAllTeams();
    }

    @Test
    void getAllTeams_ShouldReturnEmptyList() throws Exception {
        // Arrange
        when(teamService.findAllTeams()).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/team")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(teamService, times(1)).findAllTeams();
    }

    @Test
    void getTeam_WithValidId_ShouldReturnTeam() throws Exception {
        // Arrange
        when(teamService.findTeam(1L)).thenReturn(teamDto1);

        // Act & Assert
        mockMvc.perform(get("/team/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Alpha Team")))
                .andExpect(jsonPath("$.status", is(CREATED.name())));

        verify(teamService, times(1)).findTeam(1L);
    }

    @Test
    void getTeam_WithInvalidId_ShouldThrowException() throws Exception {
        // Arrange
        when(teamService.findTeam(999L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Act & Assert
        mockMvc.perform(get("/team/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(teamService, times(1)).findTeam(999L);
    }

    @Test
    void deleteTeam_WithValidId_ShouldDeleteTeam() throws Exception {
        // Arrange
        doNothing().when(teamService).deleteTeam(1L);

        // Act & Assert
        mockMvc.perform(delete("/team/{id}", 1L))
                .andExpect(status().isOk());

        verify(teamService, times(1)).deleteTeam(1L);
    }

    @Test
    void deleteTeam_WithInvalidId_ShouldThrowException() throws Exception {
        // Arrange
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND))
                .when(teamService).deleteTeam(999L);

        // Act & Assert
        mockMvc.perform(delete("/team/{id}", 999L))
                .andExpect(status().isNotFound());

        verify(teamService, times(1)).deleteTeam(999L);
    }

    @Test
    void getTeam_WithNullId_ShouldReturnBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/team/{id}", "invalid"))
                .andExpect(status().isBadRequest()); // Spring не сможет конвертировать "invalid" в Long

        verify(teamService, never()).findTeam(any());
    }

    @Test
    void createTeam_ServiceThrowsException_ShouldHandleException() throws Exception {
        // Arrange
        when(teamService.createTeam("Invalid Team"))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

        mockMvc.perform(post("/team")
                        .param("teamName", "Invalid Team")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(teamService, times(1)).createTeam("Invalid Team");
    }

    @Test
    void createTeam_WithSpecialCharacters_ShouldHandleCorrectly() throws Exception {
        String teamName = "Team @#$%^&*()";
        when(teamService.createTeam(teamName)).thenReturn(teamDto1);

        mockMvc.perform(post("/team")
                        .param("teamName", teamName)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(teamService, times(1)).createTeam(teamName);
    }
}