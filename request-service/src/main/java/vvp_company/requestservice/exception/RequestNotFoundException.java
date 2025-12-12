package vvp_company.requestservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RequestNotFoundException extends RuntimeException {
    public RequestNotFoundException(Long id) {
        super("Заявка с id = " + id + " не найдена");
    }
}