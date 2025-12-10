package vvp_company.glossaryservice.controller;

import jakarta.validation.constraints.NotEmpty;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/equipmentInfo")
public class EquipmentInfoController {

    public void getEquipmentInfoByName(@NotEmpty @RequestParam String equipmentName) {

    }
}
