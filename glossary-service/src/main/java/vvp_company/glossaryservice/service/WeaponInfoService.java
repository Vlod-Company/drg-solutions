package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.glossaryservice.dto.CreateWeaponInfoRequest;
import vvp_company.glossaryservice.dto.WeaponInfoDTO;
import vvp_company.glossaryservice.mapper.WeaponInfoMapper;
import vvp_company.glossaryservice.model.WeaponInfo;
import vvp_company.glossaryservice.repository.WeaponInfoRepository;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class WeaponInfoService {

    private final WeaponInfoRepository repository;
    private final WeaponInfoMapper mapper;
    private final ImpactTypeService impactTypeService;

    public WeaponInfoDTO getWeaponInfoByName(String name) {
        return repository.findByName(name).map(mapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Информация об оружии не найдена"));
    }

    public List<WeaponInfoDTO> getAllWeaponInfos() {
        return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public WeaponInfoDTO createWeaponInfo(CreateWeaponInfoRequest request) {
        var impactType = impactTypeService.getImpactType(request.impactTypeId());

        var entity = WeaponInfo.builder()
                .name(request.name())
                .impactType(impactType)
                .description(request.description())
                .weight(request.weight())
                .build();
        return mapper.toDto(repository.save(entity));
    }

    public WeaponInfoDTO updateWeaponInfo(Long id, CreateWeaponInfoRequest request) {
        var weaponInfoEntity = repository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Описание оружия не найдено"));

        var newName = isNull(request.name()) ? weaponInfoEntity.getName() : request.name();
        var newDescription = isNull(request.description()) ? weaponInfoEntity.getDescription() : request.description();
        var newImpactType = isNull(request.impactTypeId()) ? weaponInfoEntity.getImpactType() : impactTypeService.getImpactType(request.impactTypeId());
        var newWeight = isNull(request.weight()) ? weaponInfoEntity.getWeight() : request.weight();

        var newWeaponInfoEntity = WeaponInfo.builder()
                .id(id)
                .name(newName)
                .impactType(newImpactType)
                .description(newDescription)
                .weight(newWeight)
                .build();
        return mapper.toDto(repository.save(newWeaponInfoEntity));
    }
}
