package vvp_company.requestservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.requestservice.dto.CreateRequestDto;
import vvp_company.requestservice.dto.RequestDto;
import vvp_company.requestservice.exception.RequestNotFoundException;
import vvp_company.requestservice.model.Request;
import vvp_company.requestservice.model.Sender;
import vvp_company.requestservice.repository.RequestRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RequestService {

    private final RequestRepository requestRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public RequestDto createRequest(CreateRequestDto dto) {
        Sender sender = currentUserService.getCurrentSender();

        Request request = Request.builder()
                .status("Created")
                .senderDepartment(sender.department())
                .senderEmployeeId(sender.employeeId())
                .recipientDepartment(dto.recipientDepartment())
                .requestCode(dto.requestCode())
                .description(dto.description())
                .build();

        Request saved = requestRepository.save(request);
        return RequestDto.fromEntity(saved);
    }

    //опционально править, не у всех должен быть доступ ко всем
    public RequestDto getById(Long id) {
        return requestRepository.findById(id)
                .map(RequestDto::fromEntity)
                .orElseThrow(() -> new RequestNotFoundException(id));
    }

    public List<RequestDto> getBySenderDepartment() {
        return requestRepository.findAllBySenderDepartment(currentUserService.getCurrentSender().department()).stream()
                .map(RequestDto::fromEntity)
                .toList();
    }

    public List<RequestDto> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(RequestDto::fromEntity)
                .toList();
    }

    // Лишнее, но полезное
    public List<RequestDto> getMySentRequests() {
        Sender sender = currentUserService.getCurrentSender();
        return requestRepository.findAllBySenderEmployeeId(sender.employeeId()).stream()
                .map(RequestDto::fromEntity)
                .toList();
    }
}
