package vvp_company.requestservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.requestservice.dto.CreateRequestDto;
import vvp_company.requestservice.dto.RequestDto;
import vvp_company.requestservice.exception.RequestNotFoundException;
import vvp_company.requestservice.mapper.RequestMapper;
import vvp_company.requestservice.model.Employee;
import vvp_company.requestservice.model.Request;
import vvp_company.requestservice.repository.RequestRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final CurrentUserService currentUserService;
    private final RequestMapper requestMapper;

    @Transactional
    public RequestDto createRequest(CreateRequestDto dto) {
        Employee employee = currentUserService.getCurrentEmployee();

        var request = requestMapper.toEntityFromCreateRequest(dto, employee);
        request.setSenderEmployeeId(employee.employeeId());
        request.setSenderDepartment(employee.department());

        Request saved = requestRepository.save(request);
        return requestMapper.toDTOFromEntity(saved);
    }

    //опционально править, не у всех должен быть доступ ко всем
    public RequestDto getById(Long id) {
        return requestRepository.findById(id)
                .map(requestMapper::toDTOFromEntity)
                .orElseThrow(() -> new RequestNotFoundException(id));
    }

    public List<RequestDto> getBySenderDepartment() {
        return requestRepository.findAllBySenderDepartment(currentUserService.getCurrentEmployee().department()).stream()
                .map(requestMapper::toDTOFromEntity)
                .toList();
    }

    public List<RequestDto> getByRecipientDepartment() {
        return requestRepository.findAllByRecipientDepartment(currentUserService.getCurrentEmployee().department()).stream()
                .map(requestMapper::toDTOFromEntity)
                .toList();
    }

    public List<RequestDto> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(requestMapper::toDTOFromEntity)
                .toList();
    }

    public List<RequestDto> getMySentRequests() {
        Employee employee = currentUserService.getCurrentEmployee();
        return requestRepository.findAllBySenderEmployeeId(employee.employeeId()).stream()
                .map(requestMapper::toDTOFromEntity)
                .toList();
    }
}
