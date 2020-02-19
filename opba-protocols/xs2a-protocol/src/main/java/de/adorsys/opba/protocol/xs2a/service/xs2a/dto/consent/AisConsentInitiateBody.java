package de.adorsys.opba.protocol.xs2a.service.xs2a.dto.consent;

import de.adorsys.opba.protocol.xs2a.service.xs2a.annotations.ContextCode;
import de.adorsys.opba.protocol.xs2a.service.xs2a.annotations.FrontendCode;
import de.adorsys.opba.protocol.xs2a.service.xs2a.annotations.ValidationInfo;
import de.adorsys.opba.protocol.xs2a.service.xs2a.context.ais.Xs2aAisContext;
import de.adorsys.opba.protocol.xs2a.service.xs2a.dto.DtoMapper;
import de.adorsys.xs2a.adapter.service.model.AccountAccess;
import de.adorsys.xs2a.adapter.service.model.Consents;
import lombok.Getter;
import lombok.Setter;
import org.mapstruct.Mapper;

import javax.validation.Valid;
import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

import static de.adorsys.opba.protocol.xs2a.constant.GlobalConst.SPRING_KEYWORD;
import static de.adorsys.opba.protocol.xs2a.constant.GlobalConst.XS2A_MAPPERS_PACKAGE;

@Getter
@Setter
public class AisConsentInitiateBody {

    @Valid
    @ValidationInfo(ui = @FrontendCode("accountaccess.class"), ctx = @ContextCode("aisConsent.access"))
    @NotNull(message = "{no.ctx.accountaccess}")
    private AccountAccessBody access;

    @ValidationInfo(ui = @FrontendCode("boolean.boolean"), ctx = @ContextCode("aisConsent.recurringIndicator"))
    @NotNull(message = "{no.ctx.recurringIndicator}")
    private Boolean recurringIndicator;

    @ValidationInfo(ui = @FrontendCode("date.string"), ctx = @ContextCode("aisConsent.validUntil"))
    @NotNull(message = "{no.ctx.validUntil}")
    @FutureOrPresent(message = "{future.ctx.validUntil}")
    private LocalDate validUntil;

    @ValidationInfo(ui = @FrontendCode("textbox.integer"), ctx = @ContextCode("aisConsent.frequencyPerDay"))
    @NotNull(message = "{no.ctx.frequencyPerDay}")
    private Integer frequencyPerDay;

    // Optional
    private Boolean combinedServiceIndicator;

    @Getter
    @Setter
    public static class AccountAccessBody {

        // These fields are conditionally-validated
        private List<@Valid AccountReferenceBody> accounts;
        private List<@Valid AccountReferenceBody> balances;
        private List<@Valid AccountReferenceBody> transactions;

        private AccountAccess.AvailableAccountsEnum availableAccounts;
        private AccountAccess.AllPsd2Enum allPsd2;

        @Mapper(componentModel = SPRING_KEYWORD, implementationPackage = XS2A_MAPPERS_PACKAGE)
        public interface ToXs2aApi {
            Consents map(AccountAccessBody cons);
        }
    }

    @Getter
    @Setter
    public static class AccountReferenceBody {

        @ValidationInfo(ui = @FrontendCode("textbox.string"), ctx = @ContextCode(prefix = "aisConsent"))
        @NotBlank(message = "{no.ctx.iban}")
        private String iban;

        private String bban;
        private String pan;
        private String maskedPan;
        private String msisdn;

        // TODO check if it is necessary
        @ValidationInfo(ui = @FrontendCode("textbox.string"), ctx = @ContextCode(prefix = "aisConsent"))
        @NotBlank(message = "{no.ctx.currency}")
        private String currency;

        @Mapper(componentModel = SPRING_KEYWORD, implementationPackage = XS2A_MAPPERS_PACKAGE)
        public interface ToXs2aApi {
            AccountAccess map(AccountReferenceBody cons);
        }
    }

    @Mapper(componentModel = SPRING_KEYWORD, implementationPackage = XS2A_MAPPERS_PACKAGE)
    public interface ToXs2aApi extends DtoMapper<AisConsentInitiateBody, Consents> {
        default Consents map(Xs2aAisContext cons) {
            return map(cons.getAisConsent());
        }

        Consents map(AisConsentInitiateBody cons);
    }

    @Mapper(componentModel = SPRING_KEYWORD, implementationPackage = XS2A_MAPPERS_PACKAGE)
    public interface FromCtx extends DtoMapper<Xs2aAisContext, AisConsentInitiateBody> {

        default AisConsentInitiateBody map(Xs2aAisContext cons) {
            return null == cons.getAisConsent() ? new AisConsentInitiateBody() : cons.getAisConsent();
        }
    }
}
