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
@RequestMapping("/api/requests")
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
    public ResponseEntity<RequestDto> getRequest(@PathVariable Long id) {
        RequestDto response = requestService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<RequestDto>> getRequestsToDepartment(
            @RequestParam(name = "senderDepartment", required = false) String department) {

        if (department != null && !department.isBlank()) {
            List<RequestDto> list = requestService.getBySenderDepartment(department);
            return ResponseEntity.ok(list);
        }

        return ResponseEntity.badRequest().build();
    }

    // Свои отправленные заявки
    @GetMapping("/my-sent")
    public ResponseEntity<List<RequestDto>> getMySentRequests() {
        return ResponseEntity.ok(requestService.getMySentRequests());
    }
}