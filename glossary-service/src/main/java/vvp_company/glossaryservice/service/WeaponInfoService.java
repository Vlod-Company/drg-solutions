package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.glossaryservice.dto.WeaponInfoDTO;
import vvp_company.glossaryservice.mapper.WeaponInfoMapper;
import vvp_company.glossaryservice.repository.WeaponInfoRepository;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class WeaponInfoService {

    private final WeaponInfoRepository repository;
    private final WeaponInfoMapper mapper;

    public WeaponInfoDTO getWeaponInfoByName(String name) {
        return repository.findByName(name).map(mapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Информация об оружии не найдена"));
    }

    public List<WeaponInfoDTO> getAllWeaponInfos() {
        return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
