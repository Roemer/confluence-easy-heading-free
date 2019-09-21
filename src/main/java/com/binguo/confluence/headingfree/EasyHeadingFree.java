package com.binguo.confluence.headingfree;

import java.util.Map;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.content.render.xhtml.DefaultConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.confluence.macro.MacroExecutionException;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.renderer.RenderContext;
import com.atlassian.renderer.v2.RenderMode;
import com.atlassian.renderer.v2.macro.BaseMacro;
import com.atlassian.renderer.v2.macro.MacroException;
import com.atlassian.webresource.api.assembler.PageBuilderService;
import com.atlassian.extras.common.log.Logger;
import com.atlassian.extras.common.log.Logger.*;
import org.springframework.beans.factory.annotation.Autowired;

@Scanned
public class EasyHeadingFree extends BaseMacro implements Macro {

	private final Log log = Logger.getInstance(EasyHeadingFree.class);
	private PageBuilderService pageBuilderService;
	
	@Autowired
	public EasyHeadingFree(@ComponentImport PageBuilderService pageBuilderService) {
		this.pageBuilderService = pageBuilderService;
	}

	@Override
	public String execute(Map<String, String> map, String bodyContent, ConversionContext conversionContext)
			throws MacroExecutionException {

		// Include the css and js files into this macro
		String contextOutputType = conversionContext.getOutputType();
		if (!isPdfOrWordExport(conversionContext)) {
			pageBuilderService.assembler().resources().requireWebResource("com.binguo.confluenceheading.easy-heading:easy-heading-resources");
		}

		return MacroContentUpdateHelper.ApplyMacroToBody(map, bodyContent);
	}

	private static boolean isPdfOrWordExport(ConversionContext conversionContext)
	{
		final String outputType = conversionContext.getOutputType();
		return Constants.MACRO_OUTPUT_TYPE_PDF.equals(outputType) || Constants.MACRO_OUTPUT_TYPE_WORD.equals(outputType);
	}

	@Override
	public BodyType getBodyType() {
		return BodyType.NONE;
	}

	@Override
	public OutputType getOutputType() {
		return OutputType.BLOCK;
	}

	@Override
	public String execute(Map parameters, String body, RenderContext renderContext) throws MacroException
	{
		try
		{
			//noinspection unchecked
			return execute(parameters, body, new DefaultConversionContext(renderContext));
		}
		catch (MacroExecutionException e)
		{
			throw new MacroException(e);
		}
	}

	@Override
	public boolean hasBody()
	{
		return false;
	}

	@Override
	public RenderMode getBodyRenderMode()
	{
		return RenderMode.NO_RENDER;
	}
}
