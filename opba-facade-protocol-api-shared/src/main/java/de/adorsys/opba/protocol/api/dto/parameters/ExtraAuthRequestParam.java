package de.adorsys.opba.protocol.api.dto.parameters;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum ExtraAuthRequestParam {

    PSU_ID("psuId"),
    PSU_IP_ADDRESS("psuIpAddress");

    private final String value;

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }

    @JsonCreator
    public static ExtraAuthRequestParam fromValue(String text) {
        for (ExtraAuthRequestParam b : ExtraAuthRequestParam.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }
}
