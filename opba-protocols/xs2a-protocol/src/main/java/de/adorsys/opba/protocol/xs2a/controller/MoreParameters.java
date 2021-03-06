package de.adorsys.opba.protocol.xs2a.controller;

import de.adorsys.opba.db.domain.entity.ProtocolAction;
import de.adorsys.opba.protocol.xs2a.controller.constants.ApiPaths;
import de.adorsys.opba.protocol.xs2a.controller.constants.ApiVersion;
import de.adorsys.opba.protocol.xs2a.domain.dto.forms.PsuPassword;
import de.adorsys.opba.protocol.xs2a.domain.dto.forms.ScaChallengeResult;
import de.adorsys.opba.protocol.xs2a.domain.dto.forms.ScaSelectedMethod;
import de.adorsys.opba.protocol.xs2a.service.ContextUpdateService;
import de.adorsys.opba.protocol.xs2a.service.eventbus.ProcessEventHandlerRegistrar;
import de.adorsys.opba.protocol.xs2a.service.json.JsonPathBasedObjectUpdater;
import de.adorsys.opba.protocol.xs2a.entrypoint.Xs2aResultBodyExtractor;
import de.adorsys.opba.protocol.xs2a.service.xs2a.context.BaseContext;
import de.adorsys.opba.protocol.xs2a.service.xs2a.context.Xs2aContext;
import de.adorsys.xs2a.adapter.service.model.AccountDetails;
import de.adorsys.xs2a.adapter.service.model.TransactionsReport;
import lombok.RequiredArgsConstructor;
import org.flowable.engine.RuntimeService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Deprecated
@RestController
@RequestMapping(ApiVersion.API_1)
@RequiredArgsConstructor
@SuppressWarnings("CPD-START") // FIXME
public class MoreParameters {

    private final RuntimeService runtimeService;
    private final Xs2aResultBodyExtractor extractor;
    private final ProcessEventHandlerRegistrar registrar;
    private final JsonPathBasedObjectUpdater updater;
    private final ContextUpdateService ctxUpdater;

    @PostMapping(value = ApiPaths.MORE_PARAMETERS + "/{executionId}", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Transactional
    public CompletableFuture<? extends ResponseEntity<?>> provideMoreParameters(
            @PathVariable String executionId,
            @RequestBody @Valid @NotNull LinkedMultiValueMap<@NotBlank String, String> pathAndValueUpdates) {

        BaseContext ctx = ctxUpdater.updateContext(
                executionId,
                toUpdate -> updater.updateObjectUsingJsonPath(toUpdate, pathAndValueUpdates.toSingleValueMap()));

        runtimeService.trigger(executionId);

        if (ProtocolAction.LIST_ACCOUNTS == ctx.getAction()) {
            return accounts(ctx.getSagaId());
        } else if (ProtocolAction.LIST_TRANSACTIONS == ctx.getAction()) {
            return transactions(ctx.getSagaId());
        }

        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
    }

    // TODO duplicated code
    @PostMapping(value = ApiPaths.MORE_PARAMETERS_PSU_PASSWORD + "/{executionId}", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Transactional
    public CompletableFuture<? extends ResponseEntity<?>> receivePsuPassword(
            @PathVariable String executionId,
            @Valid PsuPassword password) {

        Xs2aContext ctx = ctxUpdater.updateContext(
                executionId,
                toUpdate -> {
                    toUpdate.setPsuPassword(password.getPsuPassword());
                    return toUpdate;
                });
        runtimeService.trigger(executionId);

        if (ProtocolAction.LIST_ACCOUNTS == ctx.getAction()) {
            return accounts(ctx.getSagaId());
        } else if (ProtocolAction.LIST_TRANSACTIONS == ctx.getAction()) {
            return transactions(ctx.getSagaId());
        }

        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
    }

    // TODO duplicated code
    @PostMapping(value = ApiPaths.MORE_PARAMETERS_SELECT_SCA_METHOD + "/{executionId}", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Transactional
    public CompletableFuture<? extends ResponseEntity<?>> receiveScaMethodSelected(
            @PathVariable String executionId,
            @Valid ScaSelectedMethod methodSelected) {

        Xs2aContext ctx = ctxUpdater.updateContext(
                executionId,
                toUpdate -> {
                    toUpdate.setUserSelectScaId(methodSelected.getScaMethodId());
                    return toUpdate;
                });
        runtimeService.trigger(executionId);

        if (ProtocolAction.LIST_ACCOUNTS == ctx.getAction()) {
            return accounts(ctx.getSagaId());
        } else if (ProtocolAction.LIST_TRANSACTIONS == ctx.getAction()) {
            return transactions(ctx.getSagaId());
        }

        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
    }

    // TODO duplicated code
    @PostMapping(value = ApiPaths.MORE_PARAMETERS_REPORT_SCA_RESULT + "/{executionId}", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Transactional
    public CompletableFuture<? extends ResponseEntity<?>> receiveScaChallengeResult(
            @PathVariable String executionId,
            @Valid ScaChallengeResult scaChallengeResult) {

        Xs2aContext ctx = ctxUpdater.updateContext(
                executionId,
                toUpdate -> {
                    toUpdate.setLastScaChallenge(scaChallengeResult.getScaChallengeResult());
                    return toUpdate;
                });
        runtimeService.trigger(executionId);

        if (ProtocolAction.LIST_ACCOUNTS == ctx.getAction()) {
            return accounts(ctx.getSagaId());
        } else if (ProtocolAction.LIST_TRANSACTIONS == ctx.getAction()) {
            return transactions(ctx.getSagaId());
        }

        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
    }

    // TODO: Duplicated code
    private CompletableFuture<ResponseEntity<List<AccountDetails>>> accounts(String sagaId) {

        CompletableFuture<ResponseEntity<List<AccountDetails>>> result = new CompletableFuture<>();
        registrar.addHandler(
                sagaId,
                response -> result.complete(ResponseEntity.ok(extractor.extractAccountListOld(response))),
                result
        );
        return result;
    }

    private CompletableFuture<ResponseEntity<TransactionsReport>> transactions(String sagaId) {

        CompletableFuture<ResponseEntity<TransactionsReport>> result = new CompletableFuture<>();
        registrar.addHandler(
                sagaId,
                response -> result.complete(ResponseEntity.ok(extractor.extractTransactionsReportOld(response))),
                result
        );
        return result;
    }
}
