package vvp_company.requestservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.requestservice.dto.CreateRequestDto;
import vvp_company.requestservice.dto.PagedRequestDto;
import vvp_company.requestservice.dto.RequestDto;
import vvp_company.requestservice.dto.RequestFilter;
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

    public RequestDto getById(Long id) {
        return requestRepository.findById(id)
                .map(requestMapper::toDTOFromEntity)
                .orElseThrow(() -> new RequestNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public PagedRequestDto getRequests(int pageNumber, int pageSize, RequestFilter filter) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        String code = isBlank(filter.code()) ? null : filter.code();
        String senderDept = isBlank(filter.senderDepartment()) ? null : filter.senderDepartment();
        String recipientDept = isBlank(filter.recipientDepartment()) ? null : filter.recipientDepartment();
        String status = isBlank(filter.status()) ? null : filter.status();

        Page<Request> requests = requestRepository.findAllByFilter(
                filter.code(),
                filter.senderDepartment(),
                filter.recipientDepartment(),
                filter.status(),
                pageable
        );
        return mapToPagedRequestDto(requests);
    }


    @Transactional(readOnly = true)
    public PagedRequestDto getBySenderDepartment(int pageNumber, int pageSize) {
        Employee current = currentUserService.getCurrentEmployee();
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Request> requests = requestRepository.findBySenderDepartment(current.department(), pageable);
        return mapToPagedRequestDto(requests);
    }

    @Transactional(readOnly = true)
    public PagedRequestDto getByRecipientDepartment(int pageNumber, int pageSize) {
        Employee current = currentUserService.getCurrentEmployee();
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Request> requests = requestRepository.findByRecipientDepartment(current.department(), pageable);
        return mapToPagedRequestDto(requests);
    }

    @Transactional(readOnly = true)
    public PagedRequestDto getAllRequests(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Request> requests = requestRepository.findAll(pageable);
        return mapToPagedRequestDto(requests);
    }

    @Transactional(readOnly = true)
    public PagedRequestDto getMySentRequests(int pageNumber, int pageSize) {
        Employee current = currentUserService.getCurrentEmployee();
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Request> requests = requestRepository.findBySenderEmployeeId(current.employeeId(), pageable);
        return mapToPagedRequestDto(requests);
    }

    private PagedRequestDto mapToPagedRequestDto(Page<Request> page) {
        List<RequestDto> dtos = page.getContent().stream()
                .map(requestMapper::toDTOFromEntity)
                .toList();
        return new PagedRequestDto(
                dtos,
                page.getNumber(),
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}
