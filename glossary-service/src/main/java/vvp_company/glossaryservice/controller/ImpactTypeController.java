package vvp_company.glossaryservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vvp_company.glossaryservice.model.ImpactType;
import vvp_company.glossaryservice.service.ImpactTypeService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("impactTypes")
public class ImpactTypeController {

    private final ImpactTypeService impactTypeService;

    @GetMapping
    public List<ImpactType> getImpactTypes() {
        return impactTypeService.findAll();
    }
}
