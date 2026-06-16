"""
Prompt Optimizer
Takes analysis results and user answers to generate optimized prompts
"""
from typing import Dict, List, Optional
from pydantic import BaseModel

class OptimizationResult(BaseModel):
    optimized_prompt: str
    improvements: List[Dict[str, str]]
    techniques_applied: List[str]
    recommended_settings: Dict[str, any]
    sources: List[str]

class PromptOptimizer:
    """Generates optimized prompts based on analysis and user input"""

    def __init__(self, context: Optional[Dict] = None):
        self.context = context or {}

    def optimize(
        self,
        original_prompt: str,
        answers: Dict[str, str],
        analysis: Optional[Dict] = None
    ) -> OptimizationResult:
        """
        Generate optimized prompt

        Args:
            original_prompt: Original user prompt
            answers: Dict of question_id -> answer
            analysis: Optional analysis results
        """
        # Build optimized prompt components
        components = self._build_components(original_prompt, answers)

        # Assemble final prompt
        optimized = self._assemble_prompt(components)

        # Document improvements
        improvements = self._document_improvements(original_prompt, optimized, components)

        # List techniques
        techniques = self._list_techniques(components)

        # Recommend settings
        settings = self._recommend_settings(answers)

        # Cite sources
        sources = self._cite_sources(techniques)

        return OptimizationResult(
            optimized_prompt=optimized,
            improvements=improvements,
            techniques_applied=techniques,
            recommended_settings=settings,
            sources=sources
        )

    def _build_components(self, original: str, answers: Dict[str, str]) -> Dict[str, str]:
        """Build prompt components from answers"""
        components = {}

        # Extract key information from answers
        output_format = answers.get("format", "")
        length = answers.get("length", "")
        audience = answers.get("audience", "")
        tone = answers.get("tone", "")
        context = answers.get("context", "")

        # Role assignment (from Persona Pattern)
        if audience:
            if "expert" in audience.lower():
                components["role"] = f"You are a technical expert in {self.context.get('domain', 'this field')}."
            elif "beginner" in audience.lower():
                components["role"] = f"You are a patient teacher explaining concepts to beginners."
            else:
                components["role"] = f"You are a knowledgeable assistant helping {audience}."

        # Context provision
        if context:
            components["context"] = f"Context:\n{context}"

        # Task definition (clear and specific)
        components["task"] = self._extract_task(original)

        # Requirements/Constraints
        requirements = []
        if length:
            requirements.append(f"Length: {length}")
        if tone:
            requirements.append(f"Tone: {tone}")
        if output_format:
            requirements.append(f"Format: {output_format}")

        if requirements:
            components["requirements"] = "Requirements:\n" + "\n".join(f"- {r}" for r in requirements)

        # Output structure (from answers)
        if output_format:
            components["output_structure"] = self._create_output_structure(output_format)

        # Add industry/solution context if available
        if self.context:
            if "industry" in self.context:
                components["industry_context"] = f"Industry: {self.context['industry']}"
            if "compliance" in self.context:
                compliance = ", ".join(self.context["compliance"])
                components["compliance"] = f"Compliance considerations: {compliance}"

        return components

    def _extract_task(self, prompt: str) -> str:
        """Extract and clarify the main task"""
        # Simple extraction - in production, this would be more sophisticated
        task = prompt.strip()

        # Ensure it starts with an action verb
        action_verbs = ["analyze", "create", "generate", "summarize", "explain", "write", "design", "develop"]
        if not any(task.lower().startswith(verb) for verb in action_verbs):
            # Try to add one
            if "?" in task:
                task = f"Answer the following question:\n{task}"
            else:
                task = f"Task: {task}"

        return task

    def _create_output_structure(self, format_type: str) -> str:
        """Create output structure template"""
        format_lower = format_type.lower()

        if "bullet" in format_lower:
            return "Format your response as:\n• [Point 1]\n• [Point 2]\n• [Point 3]"
        elif "numbered" in format_lower or "list" in format_lower:
            return "Format your response as:\n1. [First item]\n2. [Second item]\n3. [Third item]"
        elif "paragraph" in format_lower:
            return "Provide your response in paragraph form."
        elif "json" in format_lower:
            return "Format your response as valid JSON."
        elif "table" in format_lower:
            return "Format your response as a table with clear headers."
        else:
            return f"Format your response as: {format_type}"

    def _assemble_prompt(self, components: Dict[str, str]) -> str:
        """Assemble components into final optimized prompt"""
        sections = []

        # Order matters (Instructions first - Microsoft best practice)
        section_order = [
            "role",
            "industry_context",
            "context",
            "task",
            "requirements",
            "compliance",
            "output_structure"
        ]

        for section_key in section_order:
            if section_key in components:
                sections.append(components[section_key])

        # Add separator for input (if original had input)
        if "{" in components.get("task", "") or "[" in components.get("task", ""):
            sections.append("\n---\n")

        # Add output primer (Microsoft best practice)
        if "output_structure" in components:
            sections.append("\nProvide your response below:")

        return "\n\n".join(sections)

    def _document_improvements(
        self,
        original: str,
        optimized: str,
        components: Dict[str, str]
    ) -> List[Dict[str, str]]:
        """Document what improved and why"""
        improvements = []

        if "role" in components:
            improvements.append({
                "change": "Added role assignment",
                "rationale": "Persona Pattern (Vanderbilt) - Assigning expertise improves response quality"
            })

        if "requirements" in components:
            improvements.append({
                "change": "Specified clear requirements",
                "rationale": "Clear constraints (Microsoft) - Helps model understand boundaries"
            })

        if "output_structure" in components:
            improvements.append({
                "change": "Defined output format",
                "rationale": "Output Structure Specification (Anthropic) - Ensures consistent formatting"
            })

        if "\n\n" in optimized and "\n\n" not in original:
            improvements.append({
                "change": "Improved structure with sections",
                "rationale": "Clear Syntax (Best Practices) - Logical organization aids comprehension"
            })

        if "context" in components:
            improvements.append({
                "change": "Added contextual information",
                "rationale": "Grounding Context (Microsoft) - Reduces hallucinations"
            })

        if len(optimized) > len(original) * 1.5:
            improvements.append({
                "change": "Expanded with specific details",
                "rationale": "Specificity (26 Principles) - Detailed instructions yield better results"
            })

        return improvements

    def _list_techniques(self, components: Dict[str, str]) -> List[str]:
        """List prompt engineering techniques applied"""
        techniques = []

        if "role" in components:
            techniques.append("Persona Pattern (Vanderbilt)")

        if "requirements" in components:
            techniques.append("Clear Constraints (Microsoft Azure)")

        if "output_structure" in components:
            techniques.append("Output Structure Specification (Anthropic)")

        if "context" in components:
            techniques.append("Grounding Context (Microsoft)")

        techniques.append("Instructions First (Microsoft Best Practice)")
        techniques.append("Affirmative Directives (26 Principles)")

        if "compliance" in components:
            techniques.append("Security Considerations (Brex Guide)")

        return techniques

    def _recommend_settings(self, answers: Dict[str, str]) -> Dict[str, any]:
        """Recommend model settings based on task"""
        settings = {}

        # Temperature based on task type
        task_lower = answers.get("task", "").lower()

        if any(word in task_lower for word in ["creative", "story", "brainstorm"]):
            settings["temperature"] = 0.7
            settings["reasoning"] = "Higher temperature for creative tasks"
        elif any(word in task_lower for word in ["analyze", "factual", "summarize"]):
            settings["temperature"] = 0.3
            settings["reasoning"] = "Lower temperature for factual/analytical tasks"
        else:
            settings["temperature"] = 0.5
            settings["reasoning"] = "Balanced temperature for general tasks"

        # Model recommendation
        if answers.get("length", "").lower() in ["detailed", "long", "comprehensive"]:
            settings["model"] = "claude-opus"
            settings["model_reasoning"] = "Opus for long-form, detailed responses"
        else:
            settings["model"] = "claude-sonnet"
            settings["model_reasoning"] = "Sonnet for balanced speed and quality"

        return settings

    def _cite_sources(self, techniques: List[str]) -> List[str]:
        """Return list of source references"""
        sources = set()

        for technique in techniques:
            if "Anthropic" in technique:
                sources.add("Anthropic Claude Prompt Engineering Guidelines")
            if "Microsoft" in technique:
                sources.add("Microsoft Azure OpenAI Techniques")
            if "Vanderbilt" in technique:
                sources.add("Prompt Pattern Catalog (Vanderbilt University)")
            if "26 Principles" in technique:
                sources.add("Principled Instructions for LLMs (arXiv:2312.16171)")
            if "Brex" in technique:
                sources.add("Brex Prompt Engineering Security Guide")

        return sorted(list(sources))
