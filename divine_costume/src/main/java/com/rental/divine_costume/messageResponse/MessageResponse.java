package com.rental.divine_costume.messageResponse;

import lombok.*;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse<T> {

    private int httpStatusCode;
    private HttpStatus httpStatus;
    private String message;
    private T data;

    public static <T> MessageResponse<T> success(T data, String message) {
        return MessageResponse.<T>builder()
                .httpStatus(HttpStatus.OK)
                .httpStatusCode(HttpStatus.OK.value())
                .message(message)
                .data(data)
                .build();
    }

    public static <T> MessageResponse<T> error(HttpStatus status, String message) {
        return MessageResponse.<T>builder()
                .httpStatus(status)
                .httpStatusCode(status.value())
                .message(message)
                .data(null)
                .build();
    }
}
