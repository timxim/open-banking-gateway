package de.adorsys.opba.consentapi.service.mapper;

import de.adorsys.opba.consentapi.model.generated.PsuAuthRequest;
import de.adorsys.opba.protocol.api.dto.request.authorization.AisConsent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import static de.adorsys.opba.restapi.shared.GlobalConst.SPRING_KEYWORD;
import static de.adorsys.opba.restapi.shared.GlobalConst.CONSENT_MAPPERS_PACKAGE;

@Mapper(componentModel = SPRING_KEYWORD, implementationPackage = CONSENT_MAPPERS_PACKAGE)
public interface AisConsentMapper {

    @Mapping(target = "access", source = "request.consentAuth.consent.access")
    @Mapping(target = "frequencyPerDay", source = "request.consentAuth.consent.frequencyPerDay")
    @Mapping(target = "recurringIndicator", source = "request.consentAuth.consent.recurringIndicator")
    @Mapping(target = "validUntil", source = "request.consentAuth.consent.validUntil")
    AisConsent map(PsuAuthRequest request);
}
