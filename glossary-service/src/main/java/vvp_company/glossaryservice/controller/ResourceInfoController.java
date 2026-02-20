package vvp_company.glossaryservice.controller;

import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.glossaryservice.dto.CreateResourceInfoRequest;
import vvp_company.glossaryservice.dto.CreateWeaponInfoRequest;
import vvp_company.glossaryservice.dto.ResourceInfoDTO;
import vvp_company.glossaryservice.dto.WeaponInfoDTO;
import vvp_company.glossaryservice.service.ResourceInfoService;

import java.util.List;

@RestController
@RequestMapping("resourceInfo")
@RequiredArgsConstructor
public class ResourceInfoController {

    private final ResourceInfoService resourceInfoService;

    @GetMapping
    public ResourceInfoDTO getResourceInfoByName(@NotEmpty @RequestParam String resourceName) {
        return resourceInfoService.getResourceInfoByName(resourceName);
    }

    @GetMapping("all")
    public List<ResourceInfoDTO> getAllResourceInfos() {
        return resourceInfoService.getAllResourceInfos();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        resourceInfoService.delete(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PostMapping
    public ResourceInfoDTO create(@RequestBody CreateResourceInfoRequest request) {
        return resourceInfoService.createResourceInfo(request);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PutMapping("{id}")
    public ResourceInfoDTO update(@PathVariable Long id, CreateResourceInfoRequest request) {
        return resourceInfoService.updateResourceInfo(id, request);
    }
}
