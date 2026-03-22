package vvp_company.glossaryservice.controller;

import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.glossaryservice.dto.CreateWeaponInfoRequest;
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

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        weaponInfoService.delete(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PostMapping
    public WeaponInfoDTO create(@RequestBody CreateWeaponInfoRequest request) {
        return weaponInfoService.createWeaponInfo(request);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PutMapping("{id}")
    public WeaponInfoDTO update(@PathVariable Long id, CreateWeaponInfoRequest request) {
        return weaponInfoService.updateWeaponInfo(id, request);
    }
}
