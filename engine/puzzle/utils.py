import os
import uuid

def generate_job_id() -> str:
    """Generate a unique job ID."""
    return str(uuid.uuid4())

def get_output_dir() -> str:
    """Get the base output directory from environment or default to 'outputs'."""
    return os.environ.get("OUTPUT_DIR", "outputs")

def get_job_dir(job_id: str) -> str:
    """Get the specific output directory for a given job and create it if necessary."""
    base_dir = get_output_dir()
    job_dir = os.path.join(base_dir, job_id)
    os.makedirs(job_dir, exist_ok=True)
    return job_dir
