package vvp_company.glossaryservice.controller;

import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vvp_company.glossaryservice.dto.ResourceInfoDTO;
import vvp_company.glossaryservice.service.ResourceInfoService;

@RestController
@RequestMapping("resourceInfo")
@RequiredArgsConstructor
public class ResourceInfoController {

    private final ResourceInfoService resourceInfoService;

    public ResourceInfoDTO getResourceInfoByName(@NotEmpty @RequestParam String resourceName) {
        return resourceInfoService.getResourceInfoByName(resourceName);
    }
}
