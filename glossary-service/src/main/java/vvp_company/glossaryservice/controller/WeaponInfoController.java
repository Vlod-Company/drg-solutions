package vvp_company.glossaryservice.controller;

import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vvp_company.glossaryservice.dto.WeaponInfoDTO;
import vvp_company.glossaryservice.service.WeaponInfoService;

import java.util.List;

@RestController
@RequestMapping("weaponInfo")
@RequiredArgsConstructor
public class WeaponInfoController {

    private final WeaponInfoService weaponInfoService;

    @GetMapping
    public WeaponInfoDTO getWeaponInfoByName(@NotEmpty @RequestParam String weaponName) {
        return weaponInfoService.getWeaponInfoByName(weaponName);
    }

    @GetMapping("all")
    public List<WeaponInfoDTO> getAllWeaponInfos() {
        return weaponInfoService.getAllWeaponInfos();
    }
}
