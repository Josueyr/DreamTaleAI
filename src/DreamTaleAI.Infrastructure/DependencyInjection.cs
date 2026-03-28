using DreamTaleAI.Core.Interfaces;
using DreamTaleAI.Infrastructure.AI.Mock;
using DreamTaleAI.Infrastructure.AI.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DreamTaleAI.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var useMocks = configuration.GetValue<bool>("AI:UseMocks", true);

        services.AddHttpClient();

        if (useMocks)
        {
            services.AddScoped<IVisionService, MockVisionService>();
            services.AddScoped<IStoryGeneratorService, MockStoryGeneratorService>();
            services.AddScoped<IImageGeneratorService, MockImageGeneratorService>();
        }
        else
        {
            var geminiKey = configuration["AI:Gemini:ApiKey"] ?? "";

            services.AddScoped<IVisionService>(sp =>
                new GeminiVisionService(sp.GetRequiredService<IHttpClientFactory>().CreateClient(), geminiKey));

            services.AddScoped<IStoryGeneratorService>(sp =>
                new GeminiStoryGeneratorService(sp.GetRequiredService<IHttpClientFactory>().CreateClient(), geminiKey));

            services.AddScoped<IImageGeneratorService>(sp =>
                new GeminiImageGeneratorService(sp.GetRequiredService<IHttpClientFactory>().CreateClient(), geminiKey));

        }

        services.AddScoped<StoryOrchestrator>();

        return services;
    }
}
