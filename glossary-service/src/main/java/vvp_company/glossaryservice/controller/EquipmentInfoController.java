package vvp_company.glossaryservice.controller;

import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vvp_company.glossaryservice.dto.EquipmentInfoDTO;
import vvp_company.glossaryservice.service.EquipmentInfoService;

import java.util.List;

@RestController
@RequestMapping("/equipmentInfo")
@RequiredArgsConstructor
public class EquipmentInfoController {

    private final EquipmentInfoService equipmentInfoService;

    @GetMapping
    public EquipmentInfoDTO getEquipmentInfoByName(@NotEmpty @RequestParam String equipmentName) {
        return equipmentInfoService.getEquipmentInfoByName(equipmentName);
    }

    @GetMapping("all")
    public List<EquipmentInfoDTO> getAllEquipmentInfo() {
        return equipmentInfoService.getAllEquipmentInfos();
    }
}
