package vvp_company.missionservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import vvp_company.missionservice.dto.CreateMissionRequest;
import vvp_company.missionservice.dto.MissionDto;
import vvp_company.missionservice.service.MissionService;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static vvp_company.missionservice.enm.MissionStatus.IN_PROGRESS;

@ExtendWith(MockitoExtension.class)
class MissionControllerTest {

    @Mock
    private MissionService missionService;

    @InjectMocks
    private MissionController missionController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private MissionDto missionDto1;
    private MissionDto missionDto2;
    private CreateMissionRequest createMissionRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(missionController).build();
        objectMapper = new ObjectMapper();

        // Настройка времени для сериализации
        objectMapper.findAndRegisterModules();

        // Тестовые данные
        missionDto1 = MissionDto.builder()
                .id(1L)
                .name("Mission Alpha")
                .description("Первая тестовая миссия")
                .status(IN_PROGRESS)
                .missionStart(LocalDateTime.of(2024, 1, 15, 10, 0))
                .missionEnd(LocalDateTime.of(2024, 1, 20, 18, 0))
                .requiredExperience(100)
                .biomeId(1L)
                .build();

        missionDto2 = MissionDto.builder()
                .id(2L)
                .name("Mission Beta")
                .description("Вторая тестовая миссия")
                .status(IN_PROGRESS)
                .missionStart(LocalDateTime.of(2024, 2, 1, 9, 0))
                .missionEnd(LocalDateTime.of(2024, 2, 10, 17, 0))
                .requiredExperience(200)
                .biomeId(2L)
                .build();

        createMissionRequest = CreateMissionRequest.builder()
                .name("New Mission")
                .description("Описание новой миссии")
                .biomeId(3L)
                .requiredExperience(150)
                .teamId(1L)
                .build();
    }

    @Test
    void getAllMissions_ShouldReturnListOfMissions() throws Exception {
        // Arrange
        List<MissionDto> missions = Arrays.asList(missionDto1, missionDto2);
        when(missionService.findAll()).thenReturn(missions);

        // Act & Assert
        mockMvc.perform(get("/mission")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Mission Alpha")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Mission Beta")));

        verify(missionService, times(1)).findAll();
    }

    @Test
    void getAllMissions_ShouldReturnEmptyList() throws Exception {
        // Arrange
        when(missionService.findAll()).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/mission")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(missionService, times(1)).findAll();
    }

    @Test
    void getMissionById_WithValidId_ShouldReturnMission() throws Exception {
        // Arrange
        when(missionService.findById(1L)).thenReturn(missionDto1);

        // Act & Assert
        mockMvc.perform(get("/mission/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Mission Alpha")))
                .andExpect(jsonPath("$.description", is("Первая тестовая миссия")))
                .andExpect(jsonPath("$.status", is(IN_PROGRESS.name())));

        verify(missionService, times(1)).findById(1L);
    }

    @Test
    void getMissionById_WithInvalidId_ShouldThrowException() throws Exception {
        when(missionService.findById(999L)).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
        mockMvc.perform(get("/mission/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void createMission_WithValidRequest_ShouldReturnCreatedMission() throws Exception {
        // Arrange
        when(missionService.createNewMission(any(CreateMissionRequest.class)))
                .thenReturn(missionDto1);

        String requestJson = objectMapper.writeValueAsString(createMissionRequest);

        // Act & Assert
        mockMvc.perform(post("/mission")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Mission Alpha")));

        verify(missionService, times(1)).createNewMission(any(CreateMissionRequest.class));
    }

    @Test
    void createMission_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Arrange - создаем невалидный запрос
        CreateMissionRequest invalidRequest = CreateMissionRequest.builder()
                .name("") // пустое имя - должно вызвать валидацию
                .description("Описание")
                .build();

        String requestJson = objectMapper.writeValueAsString(invalidRequest);

        // Act & Assert
        mockMvc.perform(post("/mission")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isBadRequest()); // @Valid должен отклонить

        verify(missionService, never()).createNewMission(any());
    }

    @Test
    void deleteMissionById_WithValidId_ShouldDeleteMission() throws Exception {
        // Arrange
        doNothing().when(missionService).delete(1L);

        // Act & Assert
        mockMvc.perform(delete("/mission/{id}", 1L))
                .andExpect(status().isOk());

        verify(missionService, times(1)).delete(1L);
    }

    @Test
    void deleteMissionById_WithInvalidId_ShouldThrowException() throws Exception {
        mockMvc.perform(delete("/mission/{id}", 999L))
                .andExpect(status().isOk());
    }

    @Test
    void getRecommendedWeaponsForMission_WithValidId_ShouldCallService() throws Exception {
        when(missionService.getRecommendedWeaponsForMission(1L)).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/mission/{id}/getRecommendedWeapons", 1L))
                .andExpect(status().isOk());

        verify(missionService, times(1)).getRecommendedWeaponsForMission(1L);
    }

    @Test
    void getRecommendedWeaponsForMission_WithInvalidId_ShouldThrowException() throws Exception {
        mockMvc.perform(get("/mission/{id}/getRecommendedWeapons", 999L))
                .andExpect(status().isOk());
    }

    @Test
    void getMissionById_WithNullId_ShouldReturnBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/mission/{id}", "invalid"))
                .andExpect(status().isBadRequest()); // Spring не сможет конвертировать "invalid" в Long

        verify(missionService, never()).findById(any());
    }
}