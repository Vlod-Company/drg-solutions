package vvp_company.ecosystemservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import vvp_company.ecosystemservice.dto.CreateMonsterDto;
import vvp_company.ecosystemservice.dto.MonsterDto;
import vvp_company.ecosystemservice.service.MonsterService;

import java.util.List;

@RestController
@RequestMapping("monster")
@RequiredArgsConstructor
public class MonsterController {

    private final MonsterService monsterService;

    @PostMapping
    public ResponseEntity<MonsterDto> create(@Valid @RequestBody CreateMonsterDto dto) {
        MonsterDto created = monsterService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("{id}")
    public MonsterDto get(@PathVariable Long id) {
        return monsterService.getById(id);
    }

    @GetMapping
    public List<MonsterDto> getAll() {
        return monsterService.getAll();
    }

    @PutMapping("{id}")
    public MonsterDto update(@PathVariable Long id, @Valid @RequestBody CreateMonsterDto dto) {
        return monsterService.update(id, dto);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        monsterService.delete(id);
    }
}
