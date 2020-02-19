package de.adorsys.opba.protocol.xs2a.service.xs2a.context.ais;

import de.adorsys.opba.protocol.xs2a.service.xs2a.dto.consent.AisConsentInitiateBody;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class TransactionListXs2aContext extends Xs2aAisContext {

    private AisConsentInitiateBody aisConsent = new AisConsentInitiateBody(); // to avoid initialization in more-parameters

    private String iban;
    private String resourceId;
    private String currency;

    private String bookingStatus;
    private LocalDate dateFrom;
    private LocalDate dateTo;
}
