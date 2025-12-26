package vvp_company.logisticsservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.logisticsservice.client.RequestServiceClient;
import vvp_company.logisticsservice.client.dto.CreateRequestDTO;
import vvp_company.logisticsservice.dto.CreateShipmentRequest;
import vvp_company.logisticsservice.dto.sendItem.SendItemDTO;
import vvp_company.logisticsservice.dto.sendItem.SendItemTeam;

import java.util.ArrayList;
import java.util.Objects;

import static java.lang.String.format;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String ADD_TO_CARGO_MESSAGE = """
            Добавьте в cargo id = %d
            %s
            """;

    private final LogisticService logisticService;
    private final CargoService cargoService;
    private final RequestServiceClient requestServiceClient;

    @Transactional
    public void createShipment(CreateShipmentRequest createShipmentRequest) {
        var shipToPoint = createShipmentRequest.getShipToPoint();
        var shipToDate = createShipmentRequest.getShipToDate();
        var cargo = cargoService.createCargo(0, shipToDate, shipToPoint);
        logisticService.createLogistic(cargo.getId(), createShipmentRequest.getSpaceShipId());
        
        objectMapper.findAndRegisterModules();

        String stringData;
        try {
            stringData = objectMapper.writeValueAsString(createShipmentRequest.getData());
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        stringData = Objects.equals(stringData, "[]") ? "" : stringData;

        var createCargoRequest = CreateRequestDTO.builder()
                .recipientDepartment("store")
                .requestCode("XXX---XXX")
                .description(format(ADD_TO_CARGO_MESSAGE, cargo.getId(), stringData))
                .build();

        requestServiceClient.createRequest(createCargoRequest);
    }
}
