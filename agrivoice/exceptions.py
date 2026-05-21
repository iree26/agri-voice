class AgriVoiceError(Exception):
    pass


class ValidationError(AgriVoiceError):
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"Validation error on '{field}': {message}")


class GenerationError(AgriVoiceError):
    def __init__(self, message: str, original: Exception | None = None):
        self.original = original
        super().__init__(message)


class ConfigError(AgriVoiceError):
    pass
