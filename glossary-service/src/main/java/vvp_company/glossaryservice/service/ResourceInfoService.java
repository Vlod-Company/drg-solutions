package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.glossaryservice.dto.ResourceInfoDTO;
import vvp_company.glossaryservice.mapper.ResourceInfoMapper;
import vvp_company.glossaryservice.repository.ResourceInfoRepository;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ResourceInfoService {

    private final ResourceInfoRepository repository;
    private final ResourceInfoMapper mapper;

    public ResourceInfoDTO getResourceInfoByName(String name) {
        return repository.findByName(name).map(mapper::toDTO)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Информация о ресурсе не найдена"));
    }
}
