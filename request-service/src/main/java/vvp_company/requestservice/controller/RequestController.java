package vvp_company.requestservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import vvp_company.requestservice.dto.CreateRequestDto;
import vvp_company.requestservice.dto.PagedRequestDto;
import vvp_company.requestservice.dto.RequestDto;
import vvp_company.requestservice.dto.RequestFilter;
import vvp_company.requestservice.service.RequestService;

import java.util.List;

@RestController
@RequestMapping("request")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @PostMapping
    public ResponseEntity<RequestDto> createRequest(
            @Valid @RequestBody CreateRequestDto dto) {
        RequestDto created = requestService.createRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public RequestDto getRequest(@PathVariable Long id) {
        return requestService.getById(id);
    }

    @GetMapping("/filters")
    public ResponseEntity<PagedRequestDto> getRequests(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestBody(required = false) RequestFilter filter) {
        PagedRequestDto result = requestService.getRequests(pageNumber, pageSize, filter);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/from-my-department")
    public ResponseEntity<PagedRequestDto> getRequestsFromMyDepartment(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(requestService.getBySenderDepartment(pageNumber, pageSize));
    }

    @GetMapping("/to-my-department")
    public ResponseEntity<PagedRequestDto> getRequestsToMyDepartment(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(requestService.getByRecipientDepartment(pageNumber, pageSize));
    }

    @GetMapping("/my-sent")
    public ResponseEntity<PagedRequestDto> getMySentRequests(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(requestService.getMySentRequests(pageNumber, pageSize));
    }
}
