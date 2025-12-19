package vvp_company.ecosystemservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.ecosystemservice.dto.CreateImpactTypeDto;
import vvp_company.ecosystemservice.dto.ImpactTypeDto;
import vvp_company.ecosystemservice.service.ImpactTypeService;

import java.util.List;

@RestController
@RequestMapping("impact-type")
@RequiredArgsConstructor
public class ImpactTypeController {

    private final ImpactTypeService impactTypeService;

    @PreAuthorize("hasRole('ROLE_RND_EMPLOYEE') or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PostMapping
    public ResponseEntity<ImpactTypeDto> create(@Valid @RequestBody CreateImpactTypeDto dto) {
        ImpactTypeDto created = impactTypeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("{id}")
    public ImpactTypeDto get(@PathVariable Long id) {
        return impactTypeService.getById(id);
    }

    @GetMapping
    public List<ImpactTypeDto> getAll() {
        return impactTypeService.getAll();
    }

    @PreAuthorize("hasRole('ROLE_RND_EMPLOYEE') or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PutMapping("{id}")
    public ImpactTypeDto update(@PathVariable Long id, @Valid @RequestBody CreateImpactTypeDto dto) {
        return impactTypeService.update(id, dto);
    }

    @PreAuthorize("hasRole('ROLE_RND_EMPLOYEE') or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        impactTypeService.delete(id);
    }
}
