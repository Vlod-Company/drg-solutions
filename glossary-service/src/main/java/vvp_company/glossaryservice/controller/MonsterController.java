package vvp_company.glossaryservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vvp_company.glossaryservice.dto.MonsterDTO;
import vvp_company.glossaryservice.service.MonsterService;

import java.util.List;

@RestController
@RequestMapping("monster")
@RequiredArgsConstructor
public class MonsterController {

    private final MonsterService monsterService;

    @GetMapping("all")
    public List<MonsterDTO> getAllMonsters() {
        return monsterService.findAll();
    }

    @GetMapping
    public List<MonsterDTO> getAllMonstersByBiomeId(@RequestParam("biomeId") Long biomeId) {
        return monsterService.findAllByBiome(biomeId);
    }
}
