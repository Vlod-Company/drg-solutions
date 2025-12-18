package vvp_company.requestservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import vvp_company.requestservice.dto.CreateRequestDto;
import vvp_company.requestservice.dto.RequestDto;
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

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @GetMapping("/{id}")
    public RequestDto getRequest(@PathVariable Long id) {
        return requestService.getById(id);
    }

    @GetMapping("/department")
    public List<RequestDto> getRequestsToDepartment() {
        return requestService.getBySenderDepartment();
    }

    @GetMapping
    public List<RequestDto> getAllRequests() {
        return requestService.getAllRequests();
    }

    @GetMapping("/my-sent")
    public List<RequestDto> getMySentRequests() {
        return requestService.getMySentRequests();
    }
}