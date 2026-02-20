package vvp_company.glossaryservice.controller;

import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.glossaryservice.dto.CreateEquipmentInfoRequest;
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

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        equipmentInfoService.delete(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PostMapping
    public EquipmentInfoDTO create(@RequestBody CreateEquipmentInfoRequest request) {
        return equipmentInfoService.createResourceInfo(request);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PutMapping("{id}")
    public EquipmentInfoDTO update(@PathVariable Long id, CreateEquipmentInfoRequest request) {
        return equipmentInfoService.updateResourceInfo(id, request);
    }
}
