"""
Core Prompt Analysis Engine
Implements the PROMPT framework
"""
from typing import Dict, List, Optional
from pydantic import BaseModel

class PromptIssue(BaseModel):
    severity: str  # "critical", "important", "nice-to-have"
    category: str  # P, R, O, M, P, T
    message: str
    recommendation: str

class AnalysisResult(BaseModel):
    original_prompt: str
    strengths: List[str]
    issues: List[PromptIssue]
    missing_info: List[str]
    recommended_techniques: List[str]
    score: Dict[str, int]  # Score per PROMPT dimension (0-10)
    overall_score: int  # Overall score (0-100)
    questions_to_ask: List[Dict[str, str]]

class PromptAnalyzer:
    """
    Analyzes prompts using the PROMPT framework:
    - P: Purpose & Objective
    - R: Role & Context
    - O: Organization & Structure
    - M: Model Guidance
    - P: Precision & Clarity
    - T: Testing & Safety
    """

    def __init__(self, context: Optional[Dict] = None):
        self.context = context or {}

    def analyze(self, prompt: str) -> AnalysisResult:
        """Main analysis method"""
        strengths = self._find_strengths(prompt)
        issues = self._find_issues(prompt)
        missing_info = self._find_missing_info(prompt)
        techniques = self._recommend_techniques(prompt, issues)
        scores = self._calculate_scores(prompt)
        questions = self._generate_questions(missing_info)

        return AnalysisResult(
            original_prompt=prompt,
            strengths=strengths,
            issues=issues,
            missing_info=missing_info,
            recommended_techniques=techniques,
            score=scores,
            overall_score=sum(scores.values()) * 100 // (6 * 10),
            questions_to_ask=questions
        )

    def _find_strengths(self, prompt: str) -> List[str]:
        """Identify what's working well"""
        strengths = []

        if len(prompt) > 50:
            strengths.append("Adequate prompt length for detail")

        if any(word in prompt.lower() for word in ["please", "help", "create", "generate"]):
            strengths.append("Clear action verb present")

        if "?" in prompt:
            strengths.append("Question format encourages specific response")

        if any(word in prompt.lower() for word in ["example", "format", "like"]):
            strengths.append("Attempts to provide guidance")

        return strengths

    def _find_issues(self, prompt: str) -> List[PromptIssue]:
        """Identify problems and gaps"""
        issues = []

        # Purpose & Objective checks
        if len(prompt) < 20:
            issues.append(PromptIssue(
                severity="critical",
                category="Purpose",
                message="Prompt is too short and vague",
                recommendation="Expand to include clear task definition and success criteria"
            ))

        if not any(verb in prompt.lower() for verb in ["analyze", "create", "generate", "summarize", "explain", "write", "design"]):
            issues.append(PromptIssue(
                severity="critical",
                category="Purpose",
                message="No clear action verb or task specified",
                recommendation="Start with a clear action: 'Create...', 'Analyze...', 'Summarize...'"
            ))

        # Role & Context checks
        if "you are" not in prompt.lower() and "act as" not in prompt.lower():
            issues.append(PromptIssue(
                severity="important",
                category="Role",
                message="No role or persona assigned",
                recommendation="Consider: 'You are an expert in [domain]...'"
            ))

        # Organization & Structure checks
        if len(prompt) > 100 and "\n" not in prompt:
            issues.append(PromptIssue(
                severity="important",
                category="Organization",
                message="Long prompt lacks structure/formatting",
                recommendation="Use bullet points, numbered lists, or sections"
            ))

        # Model Guidance checks
        if "example" not in prompt.lower() and len(prompt) > 50:
            issues.append(PromptIssue(
                severity="nice-to-have",
                category="Model Guidance",
                message="No examples provided for complex task",
                recommendation="Add 2-3 examples of desired output"
            ))

        # Precision & Clarity checks
        if any(word in prompt.lower() for word in ["something", "anything", "somehow", "maybe"]):
            issues.append(PromptIssue(
                severity="important",
                category="Precision",
                message="Vague language detected",
                recommendation="Replace vague terms with specific instructions"
            ))

        # Testing & Safety checks
        if "if" not in prompt.lower() and "when" not in prompt.lower():
            issues.append(PromptIssue(
                severity="nice-to-have",
                category="Testing",
                message="No edge case handling specified",
                recommendation="Add: 'If unsure, respond with...'"
            ))

        return issues

    def _find_missing_info(self, prompt: str) -> List[str]:
        """Identify what information is missing"""
        missing = []

        # Check for output format specification
        if not any(word in prompt.lower() for word in ["format", "structure", "output", "respond with"]):
            missing.append("Output format/structure not specified")

        # Check for constraints
        if not any(word in prompt.lower() for word in ["length", "words", "sentences", "paragraphs", "bullet"]):
            missing.append("Length or size constraints not defined")

        # Check for audience
        if not any(word in prompt.lower() for word in ["audience", "user", "reader", "beginner", "expert"]):
            missing.append("Target audience not specified")

        # Check for tone/style
        if not any(word in prompt.lower() for word in ["tone", "style", "formal", "casual", "professional"]):
            missing.append("Tone or style preference not indicated")

        # Check for context
        if len(prompt) < 100 and "context" not in prompt.lower():
            missing.append("Background context or domain information")

        return missing

    def _recommend_techniques(self, prompt: str, issues: List[PromptIssue]) -> List[str]:
        """Recommend specific techniques from knowledge base"""
        techniques = []

        issue_categories = [issue.category for issue in issues]

        if "Purpose" in issue_categories:
            techniques.append("Task Decomposition - Break complex task into steps")

        if "Role" in issue_categories:
            techniques.append("Persona Pattern - Assign specific expertise role")

        if "Organization" in issue_categories:
            techniques.append("Clear Syntax - Use XML tags or Markdown structure")

        if "Model Guidance" in issue_categories:
            techniques.append("Few-Shot Learning - Provide 2-5 examples")
            techniques.append("Chain-of-Thought - Add 'Let's think step-by-step'")

        if "Precision" in issue_categories:
            techniques.append("Affirmative Directives - Use 'do X' not 'don't do Y'")

        if "Testing" in issue_categories:
            techniques.append("Escape Hatches - 'Say I don't know if unsure'")

        # Add context-specific recommendations
        if self.context:
            if "industry" in self.context:
                techniques.append(f"Industry Context - {self.context['industry']} specific terminology")

        return techniques

    def _calculate_scores(self, prompt: str) -> Dict[str, int]:
        """Score each PROMPT dimension (0-10)"""
        scores = {}

        # Purpose & Objective (0-10)
        purpose_score = 5
        if len(prompt) > 20:
            purpose_score += 2
        if any(verb in prompt.lower() for verb in ["analyze", "create", "generate", "summarize"]):
            purpose_score += 3
        scores["Purpose"] = min(purpose_score, 10)

        # Role & Context (0-10)
        role_score = 3
        if "you are" in prompt.lower() or "act as" in prompt.lower():
            role_score += 5
        if "expert" in prompt.lower():
            role_score += 2
        scores["Role"] = min(role_score, 10)

        # Organization & Structure (0-10)
        org_score = 5
        if "\n" in prompt:
            org_score += 3
        if any(char in prompt for char in ["•", "-", "1.", "2."]):
            org_score += 2
        scores["Organization"] = min(org_score, 10)

        # Model Guidance (0-10)
        guidance_score = 4
        if "example" in prompt.lower():
            guidance_score += 4
        if "step" in prompt.lower():
            guidance_score += 2
        scores["Model_Guidance"] = min(guidance_score, 10)

        # Precision & Clarity (0-10)
        precision_score = 6
        if any(word in prompt.lower() for word in ["something", "anything", "maybe"]):
            precision_score -= 3
        if len(prompt) > 50:
            precision_score += 2
        scores["Precision"] = max(min(precision_score, 10), 0)

        # Testing & Safety (0-10)
        safety_score = 3
        if "if" in prompt.lower() or "when" in prompt.lower():
            safety_score += 4
        if "unsure" in prompt.lower() or "don't know" in prompt.lower():
            safety_score += 3
        scores["Testing"] = min(safety_score, 10)

        return scores

    def _generate_questions(self, missing_info: List[str]) -> List[Dict[str, str]]:
        """Generate clarifying questions based on missing info"""
        questions = []

        question_map = {
            "Output format/structure not specified": {
                "question": "What format should the output be in?",
                "why": "Format specification helps the model structure the response appropriately.",
                "examples": ["Bullet points", "Numbered list", "Paragraph", "Table", "JSON"]
            },
            "Length or size constraints not defined": {
                "question": "What length should the output be?",
                "why": "Length constraints help balance detail vs. brevity.",
                "examples": ["1-2 sentences", "One paragraph (100-150 words)", "3-5 bullet points", "Detailed (500+ words)"]
            },
            "Target audience not specified": {
                "question": "Who is the target audience?",
                "why": "Audience determines appropriate complexity and terminology.",
                "examples": ["Beginners", "Technical experts", "General audience", "Executives"]
            },
            "Tone or style preference not indicated": {
                "question": "What tone or style should be used?",
                "why": "Tone affects how the message is perceived and received.",
                "examples": ["Professional", "Casual/Friendly", "Academic", "Conversational"]
            },
            "Background context or domain information": {
                "question": "What background context is important?",
                "why": "Context helps the model make informed decisions.",
                "examples": ["Industry-specific details", "User background", "Project goals", "Technical constraints"]
            }
        }

        for missing in missing_info:
            if missing in question_map:
                questions.append(question_map[missing])

        return questions
