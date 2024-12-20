package com.barataribeiro.sentinelofliberty.exceptions.throwables;

import com.barataribeiro.sentinelofliberty.exceptions.ApplicationMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class ForbiddenRequestException extends ApplicationMainException {
    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);

        problemDetail.setTitle("Forbidden");
        problemDetail.setDetail("You do not have sufficient privileges to access this resource.");

        return problemDetail;
    }
}
