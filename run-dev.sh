#!/bin/bash

# MindVaultIP Development Runner
# Automatically finds the project root and runs npm install && npm run dev
# Can be executed from any directory

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a directory contains package.json
has_package_json() {
    [ -f "$1/package.json" ]
}

# Function to check if directory name contains "mindvaultip" (case-insensitive)
is_mindvaultip_project() {
    local dirname=$(basename "$1")
    echo "$dirname" | grep -qi "mindvaultip"
}

# Function to find project root by walking up the directory tree
find_project_root_up() {
    local current_dir="$1"
    
    while [ "$current_dir" != "/" ] && [ -n "$current_dir" ]; do
        if has_package_json "$current_dir"; then
            echo "$current_dir"
            return 0
        fi
        current_dir=$(dirname "$current_dir")
    done
    
    return 1
}

# Function to search common locations for MindVaultIP project
search_common_locations() {
    local candidates=()
    local common_dirs=("$HOME/Downloads" "$HOME/Projects" "$HOME/Workspace" "$HOME/Code")
    
    for base_dir in "${common_dirs[@]}"; do
        if [ -d "$base_dir" ]; then
            # Find all directories with package.json in common locations
            while IFS= read -r -d '' dir; do
                if has_package_json "$dir"; then
                    candidates+=("$dir")
                fi
            done < <(find "$base_dir" -maxdepth 3 -type d -print0 2>/dev/null)
        fi
    done
    
    # Sort candidates, preferring MindVaultIP projects
    local mindvaultip_candidates=()
    local other_candidates=()
    
    for candidate in "${candidates[@]}"; do
        if is_mindvaultip_project "$candidate"; then
            mindvaultip_candidates+=("$candidate")
        else
            other_candidates+=("$candidate")
        fi
    done
    
    # Combine arrays (MindVaultIP projects first)
    candidates=("${mindvaultip_candidates[@]}" "${other_candidates[@]}")
    
    # Remove duplicates
    local unique_candidates=()
    for candidate in "${candidates[@]}"; do
        local is_duplicate=false
        for unique in "${unique_candidates[@]}"; do
            if [ "$candidate" = "$unique" ]; then
                is_duplicate=true
                break
            fi
        done
        if [ "$is_duplicate" = false ]; then
            unique_candidates+=("$candidate")
        fi
    done
    
    printf '%s\n' "${unique_candidates[@]}"
}

# Function to prompt user to choose from multiple candidates
choose_project() {
    local candidates=("$@")
    local count=${#candidates[@]}
    
    if [ $count -eq 0 ]; then
        return 1
    elif [ $count -eq 1 ]; then
        echo "${candidates[0]}"
        return 0
    fi
    
    print_info "Found $count project directories with package.json:"
    echo
    
    local i=1
    for candidate in "${candidates[@]}"; do
        local indicator=""
        if is_mindvaultip_project "$candidate"; then
            indicator=" (MindVaultIP project)"
        fi
        echo "  $i) $candidate$indicator"
        ((i++))
    done
    
    echo
    while true; do
        printf "Choose a project (1-$count): "
        read -r choice
        
        if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le $count ]; then
            local selected_index=$((choice - 1))
            echo "${candidates[$selected_index]}"
            return 0
        else
            print_error "Invalid choice. Please enter a number between 1 and $count."
        fi
    done
}

# Main execution
main() {
    print_info "MindVaultIP Development Runner"
    print_info "Searching for project root..."
    
    local project_root=""
    local current_dir=$(pwd)
    
    # First, check if we're already in a project directory
    if has_package_json "$current_dir"; then
        print_success "Found package.json in current directory: $current_dir"
        project_root="$current_dir"
    else
        # Try to find project root by walking up
        print_info "Searching up the directory tree..."
        if project_root=$(find_project_root_up "$current_dir"); then
            print_success "Found project root by walking up: $project_root"
        else
            # Search common locations
            print_info "Searching common project locations..."
            local candidates
            mapfile -t candidates < <(search_common_locations)
            
            if [ ${#candidates[@]} -eq 0 ]; then
                print_error "No project directories with package.json found."
                print_error "Please ensure you're in the correct directory or that the project exists."
                print_error "Searched locations:"
                print_error "  - Current directory and parent directories"
                print_error "  - ~/Downloads, ~/Projects, ~/Workspace, ~/Code"
                exit 1
            fi
            
            project_root=$(choose_project "${candidates[@]}")
            if [ -z "$project_root" ]; then
                print_error "No project selected."
                exit 1
            fi
        fi
    fi
    
    # Change to project directory
    print_info "Changing to project directory: $project_root"
    cd "$project_root"
    
    # Verify package.json exists
    if ! has_package_json "$project_root"; then
        print_error "package.json not found in $project_root"
        exit 1
    fi
    
    print_success "Project root: $project_root"
    echo
    
    # Run npm install
    print_info "Running npm install..."
    if npm install; then
        print_success "npm install completed successfully"
    else
        print_error "npm install failed"
        exit 1
    fi
    
    echo
    
    # Run npm run dev
    print_info "Starting development server..."
    print_info "Press Ctrl+C to stop the server"
    echo
    
    if npm run dev; then
        print_success "Development server stopped"
    else
        print_error "Development server failed to start"
        exit 1
    fi
}

# Run main function
main "$@"
